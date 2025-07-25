import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import { logger } from './logger';
import { JWTPayload } from '../types';

interface SocketUser {
  id: string;
  email: string;
  role: string;
}

export const initializeSocket = (io: SocketIOServer): void => {
  // Authentication middleware for socket connections
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        // Allow anonymous connections for chat
        socket.data.user = null;
        return next();
      }

      if (!process.env.JWT_SECRET) {
        return next(new Error('JWT secret not configured'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
      socket.data.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      } as SocketUser;

      next();
    } catch (error) {
      // Allow connection but mark as anonymous
      socket.data.user = null;
      next();
    }
  });

  io.on('connection', (socket) => {
    const user = socket.data.user as SocketUser | null;
    
    logger.info(`Socket connected: ${socket.id}${user ? ` (User: ${user.email})` : ' (Anonymous)'}`);

    // Join user to their personal room if authenticated
    if (user) {
      socket.join(`user:${user.id}`);
    }

    // Join general chat room
    socket.join('general-chat');

    // Handle chat message events
    socket.on('chat:send-message', async (data) => {
      try {
        const { content, isAnonymous, parentMessage } = data;
        
        // Validate message content
        if (!content || content.trim().length === 0) {
          socket.emit('error', { message: 'Message content is required' });
          return;
        }

        if (content.length > 1000) {
          socket.emit('error', { message: 'Message too long' });
          return;
        }

        // Create message object
        const messageData = {
          content: content.trim(),
          author: isAnonymous ? null : user?.id || null,
          isAnonymous: isAnonymous || !user,
          parentMessage: parentMessage || null,
          timestamp: new Date(),
          socketId: socket.id
        };

        // Broadcast to all users in general chat
        io.to('general-chat').emit('chat:new-message', messageData);

        logger.info(`Chat message sent by ${user ? user.email : 'Anonymous'}: ${content.substring(0, 50)}...`);
      } catch (error) {
        logger.error('Error handling chat message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle message reactions
    socket.on('chat:react-message', async (data) => {
      try {
        const { messageId, reaction } = data;
        
        // Broadcast reaction to all users
        io.to('general-chat').emit('chat:message-reaction', {
          messageId,
          reaction,
          userId: user?.id || null,
          timestamp: new Date()
        });
      } catch (error) {
        logger.error('Error handling message reaction:', error);
        socket.emit('error', { message: 'Failed to react to message' });
      }
    });

    // Handle typing indicators
    socket.on('chat:typing-start', () => {
      socket.to('general-chat').emit('chat:user-typing', {
        userId: user?.id || socket.id,
        isAnonymous: !user
      });
    });

    socket.on('chat:typing-stop', () => {
      socket.to('general-chat').emit('chat:user-stop-typing', {
        userId: user?.id || socket.id,
        isAnonymous: !user
      });
    });

    // Handle real-time notifications for authenticated users
    if (user) {
      socket.on('notification:mark-read', (notificationId) => {
        // Handle notification read status
        socket.emit('notification:marked-read', { notificationId });
      });
    }

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      logger.info(`Socket disconnected: ${socket.id} (${reason})${user ? ` (User: ${user.email})` : ' (Anonymous)'}`);
      
      // Notify others that user stopped typing
      socket.to('general-chat').emit('chat:user-stop-typing', {
        userId: user?.id || socket.id,
        isAnonymous: !user
      });
    });

    // Handle errors
    socket.on('error', (error) => {
      logger.error(`Socket error for ${socket.id}:`, error);
    });
  });

  logger.info('Socket.IO server initialized');
};

// Utility function to emit to specific user
export const emitToUser = (io: SocketIOServer, userId: string, event: string, data: any): void => {
  io.to(`user:${userId}`).emit(event, data);
};

// Utility function to emit to all users
export const emitToAll = (io: SocketIOServer, event: string, data: any): void => {
  io.emit(event, data);
};