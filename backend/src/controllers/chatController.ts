import { Response, NextFunction } from 'express';
import ChatMessage from '../models/ChatMessage';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthenticatedRequest, ApiResponse } from '../types';
import { parsePaginationQuery, createPaginationResult, getSkipValue } from '../utils/pagination';

export const getMessages = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { page, limit, sort, order } = parsePaginationQuery(req.query);
  const skip = getSkipValue(page, limit);

  // Build sort object
  const sortObj: any = {};
  sortObj[sort] = order === 'asc' ? 1 : -1;

  // Get only top-level messages (not replies)
  const messages = await ChatMessage.find({ parentMessage: null })
    .populate('author', 'username avatar')
    .populate({
      path: 'replies',
      populate: {
        path: 'author',
        select: 'username avatar'
      },
      options: { limit: 5, sort: { createdAt: 1 } }
    })
    .sort(sortObj)
    .skip(skip)
    .limit(limit)
    .lean();

  // Get total count for pagination
  const total = await ChatMessage.countDocuments({ parentMessage: null });

  // Transform messages to hide author info for anonymous messages
  const transformedMessages = messages.map(message => ({
    ...message,
    author: message.isAnonymous ? null : message.author,
    replies: message.replies.map((reply: any) => ({
      ...reply,
      author: reply.isAnonymous ? null : reply.author
    }))
  }));

  const pagination = createPaginationResult(page, limit, total);

  const response: ApiResponse = {
    status: 'success',
    message: 'Messages retrieved successfully',
    data: transformedMessages,
    pagination
  };

  res.status(200).json(response);
});

export const sendMessage = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { content, isAnonymous, parentMessage } = req.body;

  // Validate parent message if provided
  if (parentMessage) {
    const parent = await ChatMessage.findById(parentMessage);
    if (!parent) {
      throw new AppError('Parent message not found', 404);
    }
  }

  const message = await ChatMessage.create({
    content,
    author: isAnonymous || !req.user ? null : req.user.id,
    isAnonymous: isAnonymous || !req.user,
    parentMessage: parentMessage || null
  });

  // If this is a reply, add it to parent's replies array
  if (parentMessage) {
    await ChatMessage.findByIdAndUpdate(parentMessage, {
      $push: { replies: message._id }
    });
  }

  // Populate author information if not anonymous
  if (!message.isAnonymous && message.author) {
    await message.populate('author', 'username avatar');
  }

  // Transform message to hide author info if anonymous
  const transformedMessage = {
    ...message.toObject(),
    author: message.isAnonymous ? null : message.author
  };

  const response: ApiResponse = {
    status: 'success',
    message: 'Message sent successfully',
    data: transformedMessage
  };

  res.status(201).json(response);
});

export const replyToMessage = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { content, isAnonymous } = req.body;

  // Check if parent message exists
  const parentMessage = await ChatMessage.findById(id);
  if (!parentMessage) {
    throw new AppError('Message not found', 404);
  }

  const reply = await ChatMessage.create({
    content,
    author: isAnonymous || !req.user ? null : req.user.id,
    isAnonymous: isAnonymous || !req.user,
    parentMessage: id
  });

  // Add reply to parent message
  parentMessage.replies.push(reply._id as any);
  await parentMessage.save();

  // Populate author information if not anonymous
  if (!reply.isAnonymous && reply.author) {
    await reply.populate('author', 'username avatar');
  }

  // Transform reply to hide author info if anonymous
  const transformedReply = {
    ...reply.toObject(),
    author: reply.isAnonymous ? null : reply.author
  };

  const response: ApiResponse = {
    status: 'success',
    message: 'Reply sent successfully',
    data: transformedReply
  };

  res.status(201).json(response);
});

export const likeMessage = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const message = await ChatMessage.findById(id);

  if (!message) {
    throw new AppError('Message not found', 404);
  }

  // Increment likes (simple implementation - in production you might want to track who liked)
  message.likes += 1;
  await message.save();

  const response: ApiResponse = {
    status: 'success',
    message: 'Message liked successfully',
    data: {
      messageId: id,
      likes: message.likes
    }
  };

  res.status(200).json(response);
});

export const deleteMessage = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const { id } = req.params;

  const message = await ChatMessage.findById(id);

  if (!message) {
    throw new AppError('Message not found', 404);
  }

  // Only allow deletion if user is the author (for non-anonymous messages) or admin
  if (message.isAnonymous) {
    if (req.user.role !== 'admin') {
      throw new AppError('Cannot delete anonymous messages unless you are an admin', 403);
    }
  } else if (message.author?.toString() !== req.user.id && req.user.role !== 'admin') {
    throw new AppError('Not authorized to delete this message', 403);
  }

  // If this message has a parent, remove it from parent's replies
  if (message.parentMessage) {
    await ChatMessage.findByIdAndUpdate(message.parentMessage, {
      $pull: { replies: id }
    });
  }

  // Delete all replies to this message
  await ChatMessage.deleteMany({ parentMessage: id });

  // Delete the message
  await ChatMessage.findByIdAndDelete(id);

  const response: ApiResponse = {
    status: 'success',
    message: 'Message deleted successfully'
  };

  res.status(200).json(response);
});

export const getMessageReplies = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { page, limit, sort, order } = parsePaginationQuery(req.query);
  const skip = getSkipValue(page, limit);

  // Check if parent message exists
  const parentMessage = await ChatMessage.findById(id);
  if (!parentMessage) {
    throw new AppError('Message not found', 404);
  }

  // Build sort object
  const sortObj: any = {};
  sortObj[sort] = order === 'asc' ? 1 : -1;

  // Get replies
  const replies = await ChatMessage.find({ parentMessage: id })
    .populate('author', 'username avatar')
    .sort(sortObj)
    .skip(skip)
    .limit(limit)
    .lean();

  // Get total count for pagination
  const total = await ChatMessage.countDocuments({ parentMessage: id });

  // Transform replies to hide author info for anonymous messages
  const transformedReplies = replies.map(reply => ({
    ...reply,
    author: reply.isAnonymous ? null : reply.author
  }));

  const pagination = createPaginationResult(page, limit, total);

  const response: ApiResponse = {
    status: 'success',
    message: 'Replies retrieved successfully',
    data: transformedReplies,
    pagination
  };

  res.status(200).json(response);
});