import Product from '../product/product.model.js';
import Order from './order.model.js';
import { calculateOrderTotal } from './order.utils';

/**
 * CREATE ORDER SERVICE
 * --------------------
 * This is the HEART of checkout.
 */
export const createOrderService = async (user, cart, shippingAddress) => {
  if (!cart.items.length) {
    throw new Error('Cart is empty');
  }

  /**
   * STEP 1: Re-check stock (CRITICAL)
   * Never trust cart blindly
   */
  for (const item of cart.items) {
    const product = await Product.findById(item.productId);

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
   */
  const order = await Order.create({
    userId: user._id,
    items: cart.items.map((item) => ({
      productId: item.productId,
      title: item.productId.title || '', // populated or fallback
      price: item.priceAtTime,
      quantity: item.quantity,
    })),
    totalAmount,
    shippingAddress,
  });

  /**
   * STEP 4: Deduct stock (AFTER order created)
   */
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: -item.quantity },
    });
  }

  /**
   * STEP 5: Clear cart
   */
  await clearCartService(user._id);

  return order;
};