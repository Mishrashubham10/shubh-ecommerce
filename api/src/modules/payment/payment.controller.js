import { sendSuccess } from '../../utils/apiResponse.js';
import {
  createPaymentService,
  markPaymentSuccessService,
  markPaymentFailedService,
  handlePaymentSuccessService,
} from './payment.service.js';

/**
 * CREATE PAYMENT INTENT
 * ---------------------
 * Authenticated user starts payment
 */
export const createPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID required' });
    }

    const payment = await createPaymentService(req.user._id, orderId);

    sendSuccess({
      success: true,
      message: 'Payment initiated',
      paymentId: payment._id,
      amount: payment.amount,
    });
  } catch (err) {
    console.error('CREATE PAYMENT ERROR:', err.message);
    res.status(400).json({ message: err.message });
  }
};

/**
 * PAYMENT WEBHOOK
 * ---------------
 * No auth middleware here
 */
export const paymentWebhook = async (req, res) => {
  try {
    /**
     * In real Stripe:
     * - Verify signature
     * - Parse event type
     */
    const { orderId, userId, providerPaymentId, amount } = req.body;

    await handlePaymentSuccessService({
      orderId,
      userId,
      provider: 'STRIPE',
      providerPaymentId,
      amount,
    });

    sendSuccess({
      success: true,
      message: 'Payment webhook',
    });
  } catch (err) {
    console.error('WEBHOOK ERROR:', err.message);
    res.status(400).json({ message: 'Webhook error' });
  }
};