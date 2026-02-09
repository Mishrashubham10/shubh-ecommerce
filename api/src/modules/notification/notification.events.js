import { createNotificationService } from './notification.services';

/**
 * ORDER PAID EVENT
 */
export const onOrderPaid = async ({ order }) => {
  await createNotificationService({
    userId: order.userId,
    title: 'Order Confirmed',
    message: `Your order ${order._id} hase been placed successfully`,
    type: 'ORDER',
    metadata: { orderID: order._id },
  });
};

/**
 * SHIPMENT DELIVERED EVENT
 */
export const onShipmentDelivered = async ({ order }) => {
  await createNotificationService({
    userId: order.userId,
    title: 'Order Delivered',
    message: `Your order ${order._id} has been delivered`,
    type: 'SHIPMENT',
    metadata: { orderId: order._id },
  });
};