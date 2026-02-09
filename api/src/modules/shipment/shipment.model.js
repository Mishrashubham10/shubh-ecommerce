import mongoose from 'mongoose';

/**
 * SHIPMENT SCHEMA
 * ----------------
 * Shipment handles logistics, NOT business logic.
 */
const shipmentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      unique: true, // 1 SHIPMENT PER ORDER
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    courier: {
      type: String, // DELHIVERY, BLUEDART, ETC...
    },

    status: {
      type: String,
      enum: [
        'CREATED', // SHIPMENT CREATED
        'PICKED_UP', // PICKED BY COURIER
        'IN_TRANSIT', // MOVING
        'OUT_FOR_DELIVERY', // LAST MILE
        'DELIVERED',
        'FAILED',
        'RTO_INITIATED',
        'RTO_IN_TRANSIT',
        'RTO_DELIVERED'
      ],
      default: 'CREATED',
      index: true,
    },

    shippedAt: Date,
    deliveredAt: Date,

    addressSnapshot: {
      line1: String,
      city: String,
      pincode: String,
      country: String,
    },

    isReverse: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true },
);

const Shipment = mongoose.model('Shipment', shipmentSchema);
export default Shipment;