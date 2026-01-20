/**
 * CALCULATE CART TOTAL
 */
export const calculateCartTotal = (cart) => {
  let total = 0;

  cart.items.forEach((item) => {
    total += item.priceAtTime * item.quantity;
  });

  return total;
};