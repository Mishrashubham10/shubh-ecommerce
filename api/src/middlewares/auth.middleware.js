import jwt from 'jsonwebtoken';
import User from '../modules/auth/auth.model.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * PROTECT MIDDLEWARE
 * ------------------
 * This middleware:
 * 1. Checks if token exists
 * 2. Verifies JWT
 * 3. Fetches user from DB
 * 4. Attaches user to req.user
 *
 * If anything fails → request is blocked
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // 1️⃣ Extract token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 2️⃣ If no token → UNAUTHORIZED (NOT forbidden)
    if (!token) {
      return next(new ApiError(401, 'Not authenticated'));
    }

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Fetch user
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return next(new ApiError(401, 'User not authorized'));
    }

    // 5️⃣ Attach user
    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError(401, 'Invalid or expired token'));
  }
};

/**
 * AUTHORIZE ROLES
 * ---------------
 * This middleware checks if logged-in user
 * has one of the allowed roles.
 *
 * Usage:
 * authorizeRoles("ADMIN", "SUPER_ADMIN")
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    /**
     * req.user is added by protect middleware
     * So authorizeRoles MUST run AFTER protect
     */
    if (!req.user) {
      return next(new ApiError(401, 'Not authenticated'))
    }

    console.log(req.user.role);

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, "Forbidden: You don't have permission"))
    }

    console.log(allowedRoles);

    next(); // ROLE ALLOWED
  };
};