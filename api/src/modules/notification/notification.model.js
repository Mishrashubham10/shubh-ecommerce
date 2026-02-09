import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ['ORDER', 'SHIPMENT', 'PAYMENT', 'RETURN', 'SYSTEM'],
      index: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    metadata: {
      type: Object, // ORDERID, SHIPMENTID ETC...
    },
  },
  { timestamps: true },
);

const Notification = mongoose.model(
    'Notification',
    notificationSchema
)

export default Notification;