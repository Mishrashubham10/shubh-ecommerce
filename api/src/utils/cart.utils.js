/**
 * CALCULATE CART TOTAL
 * Pure function (no DB access)
 */
export const calculateCartTotal = (cart) => {
  return cart.items.reduce(
    (total, item) => total + item.priceAtTime * item.quantity,
  );
};