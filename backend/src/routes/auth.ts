import { Router } from 'express';
import {
  userSignup,
  userLogin,
  adminSignup,
  adminLogin,
  generateAdminVerification,
  getProfile,
  updateProfile
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validate, schemas } from '../middleware/validation';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

// Apply rate limiting to auth routes
router.use(authLimiter);

// User authentication routes
router.post('/user/signup', validate(schemas.userSignup), userSignup);
router.post('/user/login', validate(schemas.userLogin), userLogin);

// Admin authentication routes
router.post('/admin/signup', validate(schemas.adminSignup), adminSignup);
router.post('/admin/login', validate(schemas.userLogin), adminLogin);
router.post('/admin/generate-verification', authenticate, generateAdminVerification);

// Profile routes
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, validate(schemas.updateProfile), updateProfile);

export default router;