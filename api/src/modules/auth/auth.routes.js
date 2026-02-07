import express from 'express';
import {
  login,
  logout,
  logoutAll,
  refreshToken,
  register,
} from './auth.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { loginSchema, registerSchema } from './auth.validation.js';
import { protect } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.post('/logout-all', protect, logoutAll);

export default router;