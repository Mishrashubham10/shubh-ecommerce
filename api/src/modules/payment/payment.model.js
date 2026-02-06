import mongoose from 'mongoose';

/**
 * PAYMENT SCHEMA
 * --------------
 * Payment is always linked to ONE order.
 * Payment status is updated ONLY via webhook.
 */
const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    provider: {
      type: String, // RAZORPAY / STRIPE
      required: true,
      default: 'STRIPE', // FUTURE PROOF
    },

    providerPaymentId: {
      type: String, // PAYMENTINTENTID / CHARGEID
      unique: true,
      sparse: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ['PENDING', 'SUCCESS', 'FAILED'],
      default: 'PENDING',
    },
  },
  { timestamps: true },
);

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;