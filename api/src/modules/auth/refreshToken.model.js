import mongoose from "mongoose";

/**
 * REFRESH TOKEN (JWT)
 * WHOLE MONGOOSE MODEL
 */
const refreshTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    token: {
      type: String,
      required: true,
      unique: true,
    },

    expireAt: {
      type: Date,
      required: true,
    },

    isRevoked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
export default RefreshToken;