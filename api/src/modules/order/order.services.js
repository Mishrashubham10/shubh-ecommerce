import mongoose from 'mongoose';
import Product from '../product/product.model.js';
import Order from './order.model.js';
import { calculateOrderTotal, canUpdateOrderStatus } from './order.utils.js';

/**
 * CREATE ORDER SERVICE
 * --------------------
 * This is the HEART of checkout.
 */
export const createOrderService = async (user, cart, shippingAddress) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    if (!cart.items.length) {
      throw new Error('Cart is empty');
    }

    /**
     * STEP 1: Re-check stock (CRITICAL)
     * Never trust cart blindly
     * INSIDE TRANSACTION
     */
    for (const item of cart.items) {
      const product = await Product.findById(item.productId).session(session);

      if (!product || !product.isActive) {
        throw new Error('Product no longer available');
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.title}`);
      }
    }

    /**
     * STEP 2: Calculate total
     */
    const totalAmount = calculateOrderTotal(cart);

    /**
     * STEP 3: Create order with SNAPSHOTS
     * (TRANSACTIONAL)
     */
    const [order] = await Order.create(
      [
        {
          userId: user._id,
          items: cart.items.map((item) => ({
            productId: item.productId,
            title: item.productId.title || '',
            price: item.priceAtTime,
            quantity: item.quantity,
          })),
          totalAmount,
          shippingAddress,
        },
      ],
      { session },
    );

    /**
     * STEP 4: Deduct stock (AFTER order created)
     */
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        {
          $inc: { stock: -item.quantity },
        },
        { session },
      );
    }

    /**
     * STEP 5: Clear cart
     */
    await clearCartService(user._id, session);

    /**
     * ✅ COMMIT
     */
    await session.commitTransaction();
    session.endSession();

    return order;
  } catch (error) {
    /**
     * ❌ ROLLBACK
     */
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

/**
 * UPDATE ORDER SERVICE
 * --------------------
 * This is the HEART of checkout.
 */
export const updateOrderStatusService = async ({
  orderId,
  nextStatus,
  updatedBy,
}) => {
  const order = await Order.findById(orderId);

  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    throw error;
  }

  if (!canUpdateOrderStatus(order.status, nextStatus)) {
    const error = new Error(
      `Cannot change order status from ${order.status} to ${nextStatus}`,
    );
    error.statusCode = 400;
    throw error;
  }

  order.status = nextStatus;
  order.statusHistory.push({
    status: nextStatus,
    updatedBy,
  });

  await order.save();
  return order;
};

/**
 * GET ADMIN ORDER SERVICE
 * --------------------
 * This is the HEART of checkout.
 */
export const getAdminOrdersService = async ({
  page = 1,
  limit = 10,
  status,
}) => {
  const query = {};

  if (status) {
    query.status = status;
  }

  const skip = (page - 1) * limit;

  const [orders, totalOrders] = await Promise.all([
    Order.find(query)
      .populate('userId', 'email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Order.countDocuments(query),
  ]);

  return {
    orders,
    pagination: {
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: page,
      limit,
    },
  };
};

/**
 * GET ORDER BY ID ADMN ORDER SERVICE
 * --------------------
 * This is the HEART of checkout.
 */
export const getOrderByIdService = async (orderId) => {
  const order = await Order.findById(orderId)
    .populate('userId', 'email, role')
    .populate('items.productId', 'title');

  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    throw error;
  }

  return order;
};

/**
 * GET SELLER ORDER SERVICE
 * --------------------
 * This is the HEART of checkout.
 */
export const getSellerOrdersService = async ({
  sellerId,
  page = 1,
  limit = 10,
}) => {
  const skip = (page - 1) * limit;

  // STEP 1: FIND SELLER PRODUCT
  const sellerProducts = await Product.find({ sellerId }, { _id: 1 });

  const productIds = sellerProducts.map((p) => p._id);

  // STEP 2: FIND ORDERS CONTAINING THOSE PRODUCTS
  const query = {
    'items.productId': { $in: productIds },
  };

  const [orders, totalOrders] = await Promise.all([
    Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),

    Order.countDocuments(query),
  ]);

  return {
    orders,
    pagination: {
      totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: page,
      limit,
    },
  };
};

/**
 * GET USER ORDER SERVICE
 * --------------------
 * This is the HEART of checkout.
 */
export const getUserOrdersService = async ({
  userId,
  page = 1,
  limit = 10,
}) => {
  const skip = (page - 1) * limit;

  const query = { userId };

  const [orders, totalOrders] = await Promise.all([
    Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),

    Order.countDocuments(query),
  ]);

  return {
    orders,
    pagination: {
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: page,
      limit,
    },
  };
};

/**
 * GET USER ORDER BY ID
 * -------------------
 * User can only access their own order
 */
export const getUserOrderByIdService = async ({ orderId, userId }) => {
  const order = await Order.findOne({
    _id: orderId,
    userId,
  });

  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    throw error;
  }

  return order;
};

/**
 * CLEAR CART
 * -------------------
 * User can only access their own order
 */
export const clearCartService = async (userId, session) => {
  await Cart.findOneAndUpdate({ userId }, { items: [] }, { session });
};

/**
 * MARK ORDER AS PAID
 * -----------------
 * This is called ONLY after payment success is confirmed.
 * Idempotent & lifecycle-safe.
 */
export const markOrderAsPaidService = async ({ orderId, paymentId }) => {
  const order = await Order.findById(orderId);

  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    throw error;
  }

  /**
   * ✅ Idempotency guard
   * If order is already PAID or beyond, do nothing
   */
  if (order.status !== 'CREATED') {
    return order;
  }

  // UPDATE ORDER STATUS
  order.status = 'PAID';

  // ENSURE PAYMENT OBJECT EXISTS
  if (!order.payment) {
    order.payment = {};
  }

  // SYNC PAYMENT SNAPSHOT
  order.payment.paymentId = paymentId;
  order.payment.status = 'SUCCESS';
  order.payment.method = order.payment.method || 'STRIPE';

  // TRACK LIFECYCLE HISTORY
  order.statusHistory.push({
    status: 'PAID',
  });

  await order.save();
  return order;
};

/**
 * REFUND ORDER (ADMIN)
 * -------------------
 * BASIC refund: marks order as REFUNDED
 */
export const refundOrderService = async ({ orderId, adminId, reason }) => {
  const order = await Order.findById(orderId);

  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    throw error;
  }

  // REFUND ELIGIBILITY
  if (!['PAID', 'DELIVERED'].includes(order.status)) {
    const error = new Error(`Cannot refund order with status ${order.status}`);
    error.statusCode = 400;
    throw error;
  }

  // UPDATE ORDER
  order.status = 'REFUNDED';
  order.cancelReason = reason || 'Refund by admin';

  // SYNC PAYMENT SNAPSHOT
  if (order.payment) {
    order.payment.status = 'FAILED';
  }

  // TRACK LIFECYCLE
  order.statusHistory.push({
    status: 'REFUNDED',
    updatedBy: adminId,
  });

  await order.save();
  return order;
};