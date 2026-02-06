import Payment from './payment.model.js';
import Order from '../order/order.model.js';
import { markOrderAsPaidService } from '../order/order.services.js';

/**
 * CREATE PAYMENT RECORD
 * ---------------------
 * Called when user clicks "Pay"
 * Does NOT mark payment as success.
 */
export const createPaymentService = async (userId, orderId) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error();
  }

  if (order.status !== 'CREATED') {
    throw new Error('Order not eligible for payment');
  }

  // CREATE PAYMENT ENTRY
  const payment = await Payment.create({
    orderId,
    userId,
    amount: order.totalAmount,
  });

  /**
   * Normally here you'd create a Stripe PaymentIntent
   * and return clientSecret.
   *
   * We simulate that by returning paymentId.
   */
  return payment;
};

/**
 * HANDLE PAYMENT SUCCESS (WEBHOOK)
 */
export const markPaymentSuccessService = async (providerPaymentId) => {
  const payment = await Payment.findOne({ providerPaymentId });

  if (!payment) {
    throw new Error('Payment not found');
  }

  // Idemotency: avoid double processing
  if (payment.status === 'SUCCESS') return payment;

  payment.status = 'SUCCESS';
  await payment.save();

  // UPDATE ORDER
  await Order.findByIdAndUpdate(payment.orderId, {
    status: 'PAID',
  });

  return payment;
};

/**
 * HANDLE PAYMENT FAILURE (WEBHOOK)
 */
export const markPaymentFailedService = async (providerPaymentId) => {
  const payment = await Payment.findOne({ providerPaymentId });

  if (!payment) return;

  payment.status = 'FAILED';
  await payment.save();
};

/**
 * HANDLE PAYMENT SUCCESS SERVICE
 */
export const handlePaymentSuccessService = async ({
  orderId,
  userId,
  provider,
  providerPaymentId,
  amount
}) => {
  // FETCH ORDER
  const order = await Order.findById(orderId)

  if (!order) {
    throw new Error('Order not found')
  }

  // AMOUNT VERIFICATION (CRITICAL)
  if (order.totalAmount !== amount) {
    throw new Error('Payment amount mismatch')
  }

  // CREATE OR IGNORE DUPLICATE PAYMENT
  const payment = await Payment.findOneAndUpdate(
    { providerPaymentId },
    {
      orderId,
      userId,
      provider,
      providerPaymentId,
      amount,
      status: 'SUCCESS'
    },
    { upsert: true, new: true }
  )

  // SYNC ORDER STATUS
  await markOrderAsPaidService({
    orderId,
    paymentId: payment._id
  })

  return payment
}