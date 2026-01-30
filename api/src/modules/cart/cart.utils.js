/**
 * CALCULATE CART TOTAL
 */
export const calculateCartTotal = (cart) => {
  return cart.items.reduce(
    (sum, item) => sum + item.priceAtTime * item.quantity,
    0,
  );
};