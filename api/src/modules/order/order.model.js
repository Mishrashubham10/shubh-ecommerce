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
      pincode: String,
      country: String,
    },

    // ORDER LIFECYCLE
    status: {
      type: String,
      enum: [
        'CREATED', // order created, payment not done
        'PAID', // payment successful
        'SHIPPED', // handed to courier
        'OUT_FOR_DELIVERY', // optional but useful
        'DELIVERED', // completed
        'CANCELLED', // cancelled before shipping
        'REFUNDED',
      ],
      default: 'CREATED',
      index: true,
    },

    // STATUS HISTORY
    statusHistory: [
      {
        status: String,
        updatedAt: {
          type: Date,
          default: Date.now,
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User', // admin or system
        },
      },
    ],

    // PAYMENT REFRENCE (ADDED LATER)
    payment: {
      paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
      },
      method: String, // razorpay | stripe | cod
      status: {
        type: String,
        enum: ['PENDING', 'SUCCESS', 'FAILED'],
      },
    },

    // TRACKING
    tracking: {
      courier: String,
      trackingNumber: String,
    },

    // CANCEL REASON
    cancelReason: String,

    return: {
      isRequested: {
        type: Boolean,
        default: false,
      },

      reason: String,
      requestedAt: Date,

      status: {
        type: String,
        enum: ['REQUESTED', 'APPROVED', 'REJECTED', 'COMPLETED'],
      },
    },
  },
  { timestamps: true },
);

const Order = mongoose.model('Order', orderSchema);

export default Order;