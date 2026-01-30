import mongoose from 'mongoose';

/**
 * ORDER SCHEMA
 * ------------
 * Order is the SINGLE SOURCE OF TRUTH after checkout.
 * Prices & product data are SNAPSHOTTED.
 */
const orderSchema = new mongoose.Schema(
  {
    // WHO PLACE THE ORDER
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // ITEMS SNAPSHOTS (NEVER CHANGE LATER)
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        title: String,
        price: Number,
        quantity: Number,
      },
    ],

    // FINAL TOTAL CALCULATED ON BACKEND
    totalAmount: {
      type: Number,
      required: true,
    },

    // SHIPPING INFO SNAPSHOT
    shippingAddress: {
      line1: String,
      city: String,
      state: String,
      pincode: String,
      country: String,
    },

    // ORDER LIFECYCLE
    status: {
      type: String,
      enum: ['CREATED', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLLED'],
      default: 'CREATED',
    },

    // PAYMENT REFRENCE (ADDED LATER)
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
  },
  { timestamps: true },
);

const Order = mongoose.model('Order', orderSchema);

export default Order;