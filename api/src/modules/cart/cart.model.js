import mongoose from 'mongoose';

/**
 * CART SCHEMA
 * -----------
 * One cart per user
 * Cart persists across sessions & devices
 */
const cartSchema = new mongoose.Schema(
  {
    // Each cart belongs to exactly one user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // ensures ONE cart per user
      index: true,
    },

    // ITEM INSIDE CART
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },

        // QUANTITY USER WANTS
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        // PRICE SNAPSHOT (CRITICAL)
        priceAtTime: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;