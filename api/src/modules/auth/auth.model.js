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
    // USED FOR ACCOUNT CONTROL
    isActive: {
      type: Boolean,
      default: true,
    },

    // USEFUL FOR SECURITY FEATURES
    lastLoginAt: {
      type: Date,
    },

    passwordChangedAt: Date,
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: Date,
  },
  { timestamps: true },
);

/**
 * INDEXES
 * -------
 * Indexes make queries faster.
 * This is extremely important at scale.
 */

/**
 * PASSWORD HASING (BCRYPT)
 * USING SCHEMA PRE METHOD
 */
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);

  if (!this.isNew) {
    this.passwordChangedAt = Date.now() - 1000;
  }
});

/**
 * PASSWORD COMPARISION METHOD
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;