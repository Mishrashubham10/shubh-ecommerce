import { getOrCreateCart } from '../cart/cart.service.js';
import { createOrderService } from './order.services.js';

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