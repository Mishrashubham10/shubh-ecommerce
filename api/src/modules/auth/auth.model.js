import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Schema
 * ----------------
 * This defines how user data is stored in MongoDB
 * Keep it minimal for performance & security
 */

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true, // FAST LOOKUPS (IMP)
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ['USER', 'SELLER', 'ADMIN', 'SUPER_ADMIN'],
      default: 'USER',
    },
    // USERD FOR ACCOUNG CONTROL
    isActive: {
      type: Boolean,
      default: true,
    },

    // USEFUL FOR SECURITY FEATURES
    lastLoginAt: {
      type: Date,
    },

    passwordChangedAt: Date,
  },
  { timestamps: true },
);

/**
 * INDEXES
 * -------
 * Indexes make queries faster.
 * This is extremely important at scale.
 */

const User = mongoose.model('User', userSchema);

export default User;

/**
 * PASSWORD HASING (BCRYPT)
 * USING SCHEMA PRE METHOD
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

/**
 * PASSWORD COMPARISION METHOD
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};