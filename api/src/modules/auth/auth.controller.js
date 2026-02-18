import { asyncHandler } from '../../utils/asyncHandler.js';
import {
  loginUserService,
  logoutAllService,
  logoutService,
  refreshAccessTokenService,
  registerUserService,
} from './auth.service.js';

/**
 * REGISTER CONTROLLER
 */
export const register = asyncHandler(async (req, res) => {
  const data = await registerUserService(req.body);

  res.status(201).json({
    success: true,
    user: {
      id: data.user._id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
    },
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  });
});

/**
 * LOGIN
 */
export const login = asyncHandler(async (req, res) => {
  const data = await loginUserService(req.body);

  res.json({
    message: 'Login successfully',
    user: {
      id: data.user._id,
      name: data.user.name,
      email: data.user.email,
      role: data.user.role,
    },
    accessToken: data.accessToken,
    refreshToke: data.refreshToken,
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

  res.json({
    success: true,
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

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

/**
 * LOGOUT ALL
 */
export const logoutAll = asyncHandler(async (req, res) => {
  await logoutAllService({ userId: req.user._id });

  res.json({
    success: true,
    message: 'Logged out from all devices',
  });
});