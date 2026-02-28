import { ApiError } from '../../utils/ApiError.js';
import User from './auth.model.js';
import {
  generateAccessToken,
  generatePasswordResetToken,
  generateRefreshToken,
} from './auth.utils.js';
import RefreshToken from './refreshToken.model.js';
import { createHash } from 'node:crypto';

/**
 * REGISTER USER SERVICE
 * -------------
 */
export const registerUserService = async ({
  name,
  email,
  password,
  role = 'USER',
}) => {
  // 1️⃣ Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'Email already registered');
  }

  // CREATE USER (PASSWORD HASHED VIA PRE-SAVE)
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // GENERATE TOKENS
  const accessToken = generateAccessToken(user);
  const refreshTokenValue = generateRefreshToken();

  // STORE REFRESH TOKEN
  await RefreshToken.create({
    userId: user._id,
    token: refreshTokenValue,
    expireAt: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
    ),
  });

  return {
    user,
    accessToken,
    refreshToken: refreshTokenValue,
  };
};

/**
 * LOGIN USER
 * ----------
 */
export const loginUserService = async ({ email, password }) => {
  // FIND USER WITH PASSWORD
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // CHECK IF USER IS ACTIVE
  if (!user.isActive) {
    throw new ApiError(403, 'Account is disabled');
  }

  // VERIFY PASSWORD
  // const isMatch = await user.comparePassword(password);
  // if (!isMatch) {
  //   throw new ApiError(403, 'Invalid Credentials');
  // }

  // GENERATE TOKENS
  const accessToken = generateAccessToken(user);
  const refreshTokenValue = generateRefreshToken();

  // SAVE REFRESH TOKEN
  await RefreshToken.create({
    userId: user._id,
    token: refreshTokenValue,
    expireAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return {
    user,
    accessToken,
    refreshToken: refreshTokenValue,
  };
};

/**
 * REFRESH ACCESS TOKEN
 */
export const refreshAccessTokenService = async ({ refreshToken }) => {
  if (!refreshToken) {
    throw new ApiError(401, 'Refresh token required');
  }

  // FIND REFRESH TOKEN IN DB
  const storedToken = await RefreshToken.findOne({
    token: refreshToken,
    isRevoked: false,
    expireAt: { $gt: new Date() },
  });

  if (!storedToken) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  // LOAD USER
  const user = await User.findById(storedToken.userId);
  if (!user || !user.isActive) {
    throw new Error(401, 'User no longer active');
  }

  // ROTATE REFRESH TOKEN (IMPORTANT)
  storedToken.isRevoked = true;
  await storedToken.save();

  const newRefreshToken = generateRefreshToken();

  await RefreshToken.create({
    userId: user._id,
    token: newRefreshToken,
    expireAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  // ISSUE NEW ACCESS TOKEN
  const newAccessToken = generateAccessToken(user);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

/**
 * LOGOUT (single device)
 */
export const logoutService = async ({ refreshToken }) => {
  if (!refreshToken) return;

  await RefreshToken.findOneAndUpdate(
    { token: refreshToken },
    { isRevoked: true },
  );
};

/**
 * LOGOUT ALL SESSIONS
 */
export const logoutAllService = async ({ userId }) => {
  if (!userId) {
    throw new ApiError(400, 'User Id is required');
  }

  await RefreshToken.updateMany(
    { userId, isRevoked: false },
    { isRevoked: true },
  );

  return { message: 'Logged out from all devices' };
};

/**
 * FORGOT PASSWORD SERVICE
 */
export const forgotPasswordService = async (email) => {
  const user = await User.findOne({ email });

  // DONOT REVEAL WEATHER USER EXISTS
  if (!user) return;

  const { rawToken, hashedToken } = generatePasswordResetToken();

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

  await user.save({ validateBeforeSave: false });

  // For now we log token (later: send email)
  console.log('🔐 RESET TOKEN:', rawToken);

  return rawToken;
};

/**
 * RESET PASSWORD SERVICE
 */
export const resetPasswordService = async ({ token, newPassword }) => {
  const hashedToken = createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, 'Invalid or expired reset token');
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  // INVALIDATE ALL SESSIONS
  await RefreshToken.deleteMany({ userId: user._id });

  return true;
};