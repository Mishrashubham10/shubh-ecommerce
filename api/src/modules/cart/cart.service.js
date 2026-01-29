import Cart from './cart.model.js';
import Product from '../product/product.model.js';

/**
 * GET OR CREATE CART
 */
export const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }

  return cart;
};

/**
 * ADD ITEM TO CART
 */
export const addToCartService = async (userId, productId, quantity) => {
  const product = await Product.findById(productId);

  if (!product || !product.isActive) {
    throw new Error('Product not available');
  }

  if (product.stock < quantity) {
    throw new Error('Insufficient stock');
  }

  const cart = await getOrCreateCart(userId);

  // Check if product already exists in cart
  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (itemIndex > -1) {
    // UPDATE QUANTITY
    cart.items[itemIndex].quantity += quantity;
  } else {
    // ADD NEW ITEM
    cart.items.push({
      productId,
      quantity,
      priceAtTime: product.discountPrice || product.price,
    });
  }

  await cart.save();
  return cart;
};

/**
 * UPDATE CART ITEM QUANTITY
 */
export const updateCartItemService = async (userId, productId, quantity) => {
  const cart = await getOrCreateCart(userId);

  const item = cart.items.find(
    (item) => item.productId.toString() === productId
  );

  if (!item) {
    throw new Error('Item not found in cart');
  }

  if (quantity <= 0) {
    // Remove item if quantity <= 0
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );
  } else {
    item.quantity = quantity;
  }

  await cart.save();
  return cart;
};

/**
 * REMOVE ITEM FROM CART
 */
export const removeFromCartService = async (userId, productId) => {
  const cart = await getOrCreateCart(userId);

  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId
  );

  await cart.save();
  return cart;
};

/**
 * CLEAR CART (USED AFTER ORDER)
 */
export const clearCartService = async (userId) => {
  const cart = await getOrCreateCart(userId);
  cart.items = [];
  await cart.save();
  return cart;
};