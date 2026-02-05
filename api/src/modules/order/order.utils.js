export const ORDER_STATUS_FLOW = {
  CREATED: ['PAID', 'CANCELLED'],
  PAID: ['SHIPPED', 'REFUNDED'],
  SHIPPED: ['OUT_FOR_DELIVERY'],
  DELIVERED: [],
  CANCELLED: [],
  REFUNDED: [],
};

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

// VALIDATE ORDERS
export const canUpdateOrderStatus = (currentStatus, nextStatus) => {
  return ORDER_STATUS_FLOW[currentStatus]?.includes(nextStatus);
};