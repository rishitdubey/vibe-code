import { Router } from 'express';
import {
  getUsers,
  getUserById,
  getUserPosts,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  getUserStats
} from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';
import { validateQuery, schemas } from '../middleware/validation';

const router = Router();

// Public routes
router.get('/:id', getUserById);
router.get('/:id/posts', validateQuery(schemas.pagination), getUserPosts);

// Admin only routes
router.get('/', authenticate, authorize('admin'), validateQuery(schemas.pagination), getUsers);
router.put('/:id/role', authenticate, authorize('admin'), updateUserRole);
router.patch('/:id/status', authenticate, authorize('admin'), toggleUserStatus);
router.delete('/:id', authenticate, authorize('admin'), deleteUser);
router.get('/admin/stats', authenticate, authorize('admin'), getUserStats);

export default router;