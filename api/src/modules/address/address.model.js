import mongoose from 'mongoose';

/**
 * ADDRESS SCHEMA
 * --------------
 * User can have multiple addresses.
 * Used for checkout, returns, delivery, etc.
 */
const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    name: {
      type: String, // HOME / OFFICE/ ETC.
      default: 'Home',
    },

    line1: {
      type: String,
      required: true,
    },

    line2: {
      type: String,
    },

    city: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    pincode: {
      type: String,
      required: true,
    },

    country: {
      type: String,
      default: 'India',
    },

    phone: {
      type: String,
      required: true,
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Address = mongoose.model('Address', addressSchema);
export default Address;