import { asyncHandler } from '../../utils/asyncHandler.js';
import { loginUserService, registerUserService } from './auth.service.js';

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
    refreshToke: data.refreshToken,
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