import { sendSuccess } from '../../utils/apiResponse.js';
import {
  addToCartService,
  getOrCreateCart,
  removeFromCartService,
  updateCartItemService,
} from './cart.service.js';
import { calculateCartTotal } from './cart.utils.js';
import {
  validateAddToCart,
  validateRemoveFromCart,
} from './cart.validation.js';

/**
 * GET CART
 */
export const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);

    /**
     * Populate product info
     */
    await cart.populate({
      path: 'items.productId',
      select: 'title images price discountPrice stock',
    });

    const totalPrice = calculateCartTotal(cart);

    sendSuccess({
      success: true,
      message: 'Cart fetched successfully',
      data: {
        ...cart.toObject(),
        totalPrice
      },
    });
  } catch (error) {
    console.error('GET CART ERROR:', error.message);
    res.status(500).json({ message: 'Failed to fetch cart' });
  }
};

/**
 * ADD TO CART
 */
export const addToCart = async (req, res) => {
  try {
    const error = validateAddToCart(req.body);
    if (error) {
      return res.status(400).json({ message: error });
    }

    const { productId, quantity } = req.body;

    const cart = await addToCartService(req.user._id, productId, quantity);

    sendSuccess({
      success: true,
      message: 'Item added to cart',
      cart
    });
  } catch (error) {
    console.error('ADD TO CART ERROR:', error.message);
    res.status(400).json({ message: error.message });
  }
};

/**
 * UPDATE CART ITEM
 */
export const updateCartItem = async (req, res) => {
  try {
    const error = validateAddToCart(req.body);
    if (error) {
      return res.status(400).json({ message: error });
    }

    const { productId, quantity } = req.body;

    const cart = await updateCartItemService(req.user._id, productId, quantity);

    sendSuccess({
      success: true,
      message: 'Cart updated successfully',
      cart
    });
  } catch (error) {
    console.error('UPDATE CART ERROR:', error.message);
    res.status(400).json({ message: error.message });
  }
};

/**
 * REMOVE ITEM FROM CART
 */
export const removeFromCart = async (req, res) => {
  try {
    const error = validateRemoveFromCart(req.body);
    if (error) {
      return res.status(400).json({ message: error });
    }

    const { productId } = req.body;

    const cart = await removeFromCartService(req.user._id, productId);

    sendSuccess({
      success: true,
      message: 'Item removed from cart',
      cart
    });
  } catch (error) {
    console.error('REMOVE FROM CART ERROR:', error.message);
    res.status(400).json({ message: error.message });
  }
};