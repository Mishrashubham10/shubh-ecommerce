import express from 'express';
import {
  forgotPassword,
  login,
  logout,
  logoutAll,
  refreshToken,
  register,
  resetPassword,
} from './auth.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { loginSchema, registerSchema } from './auth.validation.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.post('/logout-all', protect, logoutAll);

// FORGOT & RESET PASSWORD
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;