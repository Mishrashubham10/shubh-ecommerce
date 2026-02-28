import { asyncHandler } from '../../utils/asyncHandler.js';
import {
  forgotPasswordService,
  loginUserService,
  logoutAllService,
  logoutService,
  refreshAccessTokenService,
  registerUserService,
  resetPasswordService,
} from './auth.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';

/**
 * REGISTER CONTROLLER
 */
export const register = asyncHandler(async (req, res) => {
  const data = await registerUserService(req.body);

  sendSuccess(res, {
    success: true,
    message: 'User registered successfully',
    user: {
      id: data.user._id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
    },
    accessToken,
    refreshToken,
  });
});

/**
 * LOGIN
 */
export const login = asyncHandler(async (req, res) => {
  const data = await loginUserService(req.body);

  sendSuccess(res, {
    success: true,
    message: 'User logged in successfully',
    user: {
      id: data.user._id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
    },
    accessToken,
    refreshToken,
  });
});

/**
 * REFRESH TOKEN
 */
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  const data = await refreshAccessTokenService({
    refreshToken,
  });

  sendSuccess(res, {
    success: true,
    message: 'Refresh Token created',
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  });
});

/**
 * LOGOUT
 */
export const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  await logoutService({ refreshToken });

  sendSuccess(res, {
    success: true,
    message: 'User Logged out successfully',
  });
});

/**
 * LOGOUT ALL
 */
export const logoutAll = asyncHandler(async (req, res) => {
  await logoutAllService({ userId: req.user._id });

  sendSuccess(res, {
    success: true,
    message: 'User Logged out from all devices',
  });
});

/**
 * FORGOT PASSWORD
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  await forgotPasswordService(email);

  sendSuccess(res, {
    success: true,
    message: 'If that email exists, a reset link has been sent!',
  });
});

/**
 * RESET PASSWORD
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  await resetPasswordService({
    token,
    newPassword: password,
  });

  sendSuccess(res, {
    success: true,
    message: 'Password reset successful',
  });
});