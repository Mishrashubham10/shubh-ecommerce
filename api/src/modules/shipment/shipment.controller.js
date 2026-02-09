import { asyncHandler } from '../../utils/asyncHandler.js';
import {
  getSellerShipmentsService,
  getUserShipmentByOrderService,
  handleCourierWebhookService,
  updateShipmentStatusService,
} from './shipment.services.js';

/**
 * UPDATE SHIPMENT STATUS CONTROLLER
 */
export const updateShipmentStatus = asyncHandler(async (req, res) => {
  const { shipmentId } = req.params;
  const { status } = req.body;

  const shipment = await updateShipmentStatusService({
    shipmentId,
    status,
    adminId: req.user._id,
  });

  res.json({
    success: true,
    shipment,
  });
});

/**
 * GET USER SHIPMENT TRACKING CONTROLLER
 */
export const getUserShipmentTracking = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const shipment = await getUserShipmentByOrderService({
    orderId,
    userId: req.user._id,
  });

  res.json({
    success: true,
    shipment,
  });
});

/**
 * GET SELLER SHIPMENTS
 */
export const getSellerShipments = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;

  const data = await getSellerShipmentsService({
    sellerId: req.user._id,
    page: Number(page) || 1,
    limit: Number(limit) || 10,
  });

  res.json({
    success: true,
    ...data,
  });
});

/**
 * COURIER WEBHOOK (SIMULATED)
 */
export const courierWebhook = asyncHandler(async (req, res) => {
  const { trackingNumber, status } = req.body;

  if (!trackingNumber || !status) {
    return res.status(400).json({
      success: false,
      message: 'Invalid webhook payload',
    });
  }

  await handleCourierWebhookService({
    trackingNumber,
    status,
  });

  res.json({ success: true });
});