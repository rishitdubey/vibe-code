import { Router } from 'express';
import {
  getMessages,
  sendMessage,
  replyToMessage,
  likeMessage,
  deleteMessage,
  getMessageReplies
} from '../controllers/chatController';
import { authenticate, optionalAuth } from '../middleware/auth';
import { validate, validateQuery, schemas } from '../middleware/validation';

const router = Router();

// Chat message routes
router.get('/messages', optionalAuth, validateQuery(schemas.pagination), getMessages);
router.post('/messages', optionalAuth, validate(schemas.createChatMessage), sendMessage);
router.post('/messages/:id/reply', optionalAuth, validate(schemas.createChatMessage), replyToMessage);
router.post('/messages/:id/like', optionalAuth, likeMessage);
router.delete('/messages/:id', authenticate, deleteMessage);
router.get('/messages/:id/replies', optionalAuth, validateQuery(schemas.pagination), getMessageReplies);

export default router;