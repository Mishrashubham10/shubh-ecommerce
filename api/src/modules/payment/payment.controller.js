import {
  createPaymentService,
  markPaymentSuccess,
  markPaymentFailed,
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

    res.status(201).json({
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
    const { eventType, providerPaymentId } = req.body;

    if (eventType === 'PAYMENT_SUCCESS') {
      await markPaymentSuccess(providerPaymentId);
    }

    if (eventType === 'PAYMENT_FAILED') {
      await markPaymentFailed(providerPaymentId);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error('WEBHOOK ERROR:', err.message);
    res.status(400).json({ message: 'Webhook error' });
  }
};