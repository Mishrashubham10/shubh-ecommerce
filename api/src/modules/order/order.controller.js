import { getOrCreateCart } from '../cart/cart.service.js';
import {
  createOrderService,
  getAdminOrdersService,
  getOrderByIdService,
  getSellerOrdersService,
  getUserOrderByIdService,
  getUserOrdersService,
  updateOrderStatusService,
} from './order.services.js';

/**
 * CREATE ORDER CONTROLLER
 */
export const createOrder = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);

    const { shippingAddress } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({
        message: 'Shipping address is required',
      });
    }

    const order = await createOrderService(req.user, cart, shippingAddress);

    res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (err) {
    console.error('CREATE ORDER ERROR:', err.message);
    res.status(400).json({ message: err.message });
  }
};

/**
 * UPDATE ORDER CONTROLLER
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await updateOrderStatusService({
      orderId,
      nextStatus: status,
      updatedBy: req.user._id,
    });

    res.json({
      message: 'Order status updated successfully',
      order,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Something went wrong',
    });
  }
};

/**
 * ADMIN ORDER CONTROLLER
 **/
export const getAdminOrders = async (req, res) => {
  try {
    const { page, limit, status } = req.query;

    const data = await getAdminOrdersService({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      status,
    });

    res.json({
      message: 'Orders fetched successfully',
      ...data,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Failed to fetch orders',
    });
  }
};

/**
 * ADMIN ORDER BY ID CONTROLLER
 **/
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await getOrderByIdService(orderId);

    res.json({
      message: 'Order fetched successfully',
      order,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to fetch order',
    });
  }
};

/**
 * GET SELLER ORDERS CONTROLLER
 **/
export const getSellerOrders = async (req, res) => {
  try {
    const { page, limit } = req.query;

    const data = await getSellerOrdersService({
      sellerId: req.user._id,
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    });

    res.json({
      message: 'Seller orders fetched successfully',
      ...data,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Failed to fetch seller orders',
    });
  }
};

/**
 * GET USER OWN ORDERS CONTROLLER
 **/
export const getUserOrders = async (req, res) => {
  try {
    const { page, limit } = req.query;

    const data = await getUserOrdersService({
      userId: req.user._id,
      page: Number(page) || 1,
      limit: Number(limit) || 1,
    });

    res.json({
      message: 'User orders fetched successfully',
      ...data,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Failed to fetch orders',
    });
  }
};

/**
 * GET USER ORDER DETAILS
 */
export const getUserOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await getUserOrderByIdService({
      orderId,
      userId: req.user._id,
    });

    res.json({
      message: 'Order fetched successfully',
      order,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to fetch order',
    });
  }
};