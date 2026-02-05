import express from 'express';
import {
  createOrder,
  getAdminOrders,
  getOrderById,
  getSellerOrders,
  getUserOrderById,
  getUserOrders,
  updateOrderStatus,
} from './order.controller.js';
import { authorizeRoles, protect } from '../../middlewares/auth.middleware.js';

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

/**
 * SELLER ROUTES
 */
router.get('/seller', protect, authorizeRoles('SELLER'), getSellerOrders);

export default router;