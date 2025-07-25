import { Router } from 'express';
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  toggleSave,
  getSavedPosts,
  addComment,
  getComments,
  deleteComment
} from '../controllers/postController';
import { authenticate, optionalAuth } from '../middleware/auth';
import { validate, validateQuery, schemas } from '../middleware/validation';

const router = Router();

// Post routes
router.get('/', optionalAuth, validateQuery(schemas.pagination), getPosts);
router.post('/', authenticate, validate(schemas.createPost), createPost);
router.put('/:id', authenticate, validate(schemas.updatePost), updatePost);
router.delete('/:id', authenticate, deletePost);

// Post interactions
router.post('/:id/like', authenticate, toggleLike);
router.post('/:id/save', authenticate, toggleSave);
router.get('/saved', authenticate, validateQuery(schemas.pagination), getSavedPosts);

// Comment routes
router.get('/:id/comments', optionalAuth, validateQuery(schemas.pagination), getComments);
router.post('/:id/comments', authenticate, validate(schemas.createComment), addComment);
router.delete('/comments/:id', authenticate, deleteComment);

export default router;