import { ApiError } from '../../utils/ApiError.js';
import Order from '../order/order.model.js';
import { updateOrderStatusInternalService } from '../order/order.services.js';
import Product from '../product/product.model.js';
import Shipment from './shipment.model.js';
import { SHIPMENT_TO_ORDER_STATUS } from './shipment.utils.js';

/**
 * CREATE SHIPMENT SERVICE
 * ----------------
 * Called after order is PAID
 */
export const createShipmentService = async ({ order }) => {
  return await Shipment.create({
    orderId: order._id,
    userId: order.userId,
    addressSnapshot: order.shippingAddress,
  });
};

/**
 * UPDATE SHIPMENT SERVICE (ADMIN)
 * ----------------
 * Called after shipment is started
 */
export const updateShipmentService = async ({
  shipmentId,
  courier,
  trackingNumber,
  status,
}) => {
  const shipment = await Shipment.findById(shipmentId);

  if (!shipment) {
    throw new ApiError(404, 'Shipment not found');
  }

  if (courier) shipment.courier = courier;
  if (trackingNumber) shipment.trackingNumber = trackingNumber;

  if (status) {
    shipment.status = status;

    if (status === 'DELIVERED') {
      shipment.deliveredAt = new Date();
    }
  }

  await shipment.save();
  return shipment;
};

/**
 * UPDATE SHIPMENT STATUS (ADMIN / COURIER)
 * ---------------------------------------
 * Automatically syncs order status if needed
 */
export const updateShipmentStatusService = async ({
  shipmentId,
  status,
  adminId = null,
}) => {
  const shipment = await Shipment.findById(shipmentId);

  if (!shipment) {
    throw new ApiError(404, 'Shipment not found');
  }

  shipment.status = status;

  if (status === 'DELIVERED') {
    shipment.deliveredAt = new Date();
  }

  if (status === 'RTO_DELIVERED') {
    shipment.deliveredAt = new Date();
  }

  await shipment.save();

  const mappedOrderStatus = SHIPMENT_TO_ORDER_STATUS(status);

  if (mappedOrderStatus) {
    await updateOrderStatusInternalService({
      orderId: shipment.orderId,
      nextStatus: mappedOrderStatus,
      updatedBy: adminId,
    });
  }

  return shipment;
};

/**
 * GET USER SHIPMENT BY ORDER
 * -------------------------
 * User can only access shipment of their own order
 */
export const getUserShipmentByOrderService = async ({ orderId, userId }) => {
  const shipment = await Shipment.findOne({
    orderId,
    userId,
  });

  if (!shipment) {
    throw new ApiError(404, 'Shipment not found');
  }

  return shipment;
};

/**
 * GET SELLER SHIPMENTS SERVICE
 * -------------------
 * Fetch shipments for orders that include seller's products
 */
export const getSellerShipmentsService = async ({
  sellerId,
  page = 1,
  limit = 10,
}) => {
  const skip = (page - 1) * limit;

  // FIND SELLERS PRODUCT
  const products = await Product.find(
    {
      sellerId,
    },
    { _id: 1 },
  );

  if (!products.length) {
    return {
      shipments: [],
      pagination: {
        totalShipments: 0,
        totalPages: 0,
        currentPage: page,
        limit,
      },
    };
  }

  const productIds = products.map((p) => p._id);

  // FIND ORDERS CONTAINING THOSE PRODUCTS
  const orders = await Order.find(
    { 'items.productId': { $in: productIds } },
    { _id: 1 },
  );

  const orderIds = orders.map((o) => o._id);

  // FIND SHIPMENTS FOR THOSE ORDERS
  const query = { orderId: { $in: orderIds } };

  const [shipments, totalShipments] = await Promise.all([
    Shipment.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),

    Shipment.countDocuments(query),
  ]);

  return {
    shipments,
    pagination: {
      totalShipments,
      totalPages: Math.ceil(totalShipments / limit),
      currentPage: page,
      limit,
    },
  };
};

/**
 * HANDLE COURIER WEBHOOK
 * ---------------------
 * Idempotent & safe
 */
export const handleCourierWebhookService = async ({
  trackingNumber,
  status,
}) => {
  const shipment = await Shipment.findOne({ trackingNumber });

  if (!shipment) {
    throw new ApiError(404, 'Shipment not found for tracking number');
  }

  /**
   * ✅ Idempotency guard
   * Ignore duplicate or same-state updates
   */
  if (shipment.status === status) {
    return shipment;
  }

  if (status === 'FAILED') {
    shipment.status = 'RTO_INITIATED';
    await shipment.save();
    return shipment;
  }

  /**
   * Delegate to core shipment update logic
   * (this already syncs order)
   */
  return await updateShipmentStatusService({
    shipmentId: shipment._id,
    status,
  });
};

/**
 * HANLDE DELIVARY FAILURE SERVICE
 * -------------------
 */
export const handleDeliveryFailureService = async ({
  shipmentId,
  reason = 'Delivery failed',
}) => {
  const shipment = await Shipment.findById(shipmentId);

  if (!shipment) {
    throw new ApiError(404, 'Shipment not found');
  }

  // MARK AS FAILED
  shipment.status = 'FAILED';
  shipment.failureReason = reason;

  // INITIATE RTO
  shipment.status = 'RTO_INITIATED';

  await shipment.save();

  return shipment;
};

/**
 * CREATE REVERSE SHIPMENT SERVICE
 * -------------------
 */
export const createReverseShipmentService = async ({ order }) => {
  return await Shipment.create({
    orderId: order._id,
    userId: order.userId,
    addressSnapshot: order.shippingAddress,
    isReverse: true,
    status: 'CREATED',
  });
};