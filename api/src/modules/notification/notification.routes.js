import express from 'express';
import { authorizeRoles, protect } from '../../middlewares/auth.middleware.js';
import { getMyNotifications, markAsRead } from './notification.controller.js';

const router = express.Router();

router.get(
  '/my',
  protect,
  authorizeRoles('USER', 'SELLER', 'ADMIN'),
  getMyNotifications,
);

router.patch('/:notificationId/read', protect, markAsRead);

export default router;