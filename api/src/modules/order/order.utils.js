/**
 * CALCULATE ORDER TOTAL
 * ---------------------
 * Uses cart snapshot prices
 */
export const calculateOrderTotal = (cart) => {
  return cart.items.reduce(
    (sum, item) => sum + item.priceAtTime * item.quantity,
    0,
  );
};