import express from 'express';
import {
  createOrder,
  getAdminOrders,
  getOrderById,
  getSellerOrders,
  getUserOrderById,
  getUserOrders,
  refundOrder,
  requestReturn,
  updateOrderStatus,
} from './order.controller.js';
import { authorizeRoles, protect } from '../../middlewares/auth.middleware.js';
import { reviewReturnService } from './order.services.js';

const router = express.Router();

/**
 * USER PROTECTED ROUTES
 */
router.post('/', protect, createOrder);

/**
 * USER ROUTES
 */
router.get('/my-orders', protect, authorizeRoles('USER'), getUserOrders);
router.get(
  '/my-orders/:orderId',
  protect,
  authorizeRoles('USER'),
  getUserOrderById,
);

/**
 * ADMIN ROUTES
 */
router.put(
  '/admin/:orderId/status',
  protect,
  authorizeRoles('ADMIN'),
  updateOrderStatus,
);
router.get(
  '/admin',
  protect,
  authorizeRoles('ADMIN', 'SUPER_ADMIN'),
  getAdminOrders,
);
router.get(
  '/admin/:orderId',
  protect,
  authorizeRoles('ADMIN', 'SUPER_ADMIN'),
  getOrderById,
);
router.post(
  '/admin/:orderId/refund',
  protect,
  authorizeRoles('ADMIN', 'SUPER_ADMIN'),
  refundOrder,
);
router.post(
  '/admin/:orderId/return-review',
  protect,
  authorizeRoles('ADMIN', 'SUPER_ADMIN'),
  reviewReturnService
);

/**
 * SELLER ROUTES
 */
router.get('/seller', protect, authorizeRoles('SELLER'), getSellerOrders);

router.post(
  '/my-orders/:orderId/return',
  protect,
  authorizeRoles('USER'),
  requestReturn,
);

export default router;