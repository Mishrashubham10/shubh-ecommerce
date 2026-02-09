import express from 'express';
import { authorizeRoles, protect } from '../../middlewares/auth.middleware.js';
import {
  courierWebhook,
  getSellerShipments,
  getUserShipmentTracking,
  updateShipmentStatus,
} from './shipment.controller.js';

const router = express.Router();

/**
 * COURIER WEBHOOK
 */
router.post("/webhook/courier", courierWebhook);

router.put(
  '/admin/:shipmentId/status',
  protect,
  authorizeRoles('ADMIN', 'SUPER_ADMIN'),
  updateShipmentStatus,
);

/**
 * USER SHIPMENT TRACKING
 */
router.get(
  '/track/:orderId',
  protect,
  authorizeRoles('USER'),
  getUserShipmentTracking,
);

/**
 * SELLER SHIPMENTS
 */
router.get('seller', protect, authorizeRoles('SELLER'), getSellerShipments);

export default router;