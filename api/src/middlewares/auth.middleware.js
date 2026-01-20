import jwt from 'jsonwebtoken';
import User from '../modules/user/user.model.js';

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

    console.log(req.headers.authorization);

    /**
     * STEP 1: Extract token
     * ---------------------
     * We expect token in Authorization header:
     * Authorization: Bearer <token>
     */
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // ❌ No token → unauthorized
    if (!token) {
      return res.status(401).json({
        message: 'Not authorized, token missing',
      });
    }

    /**
     * STEP 2: Verify token
     * -------------------
     * If token is invalid or expired, jwt.verify will throw an error
     */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    /**
     * STEP 3: Fetch user from DB
     * --------------------------
     * We DO NOT trust token blindly.
     * User might be deleted or blocked.
     */
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({
        message: 'User not found or inactive',
      });
    }

    /**
     * STEP 4: Attach user to request
     * ------------------------------
     * Now every protected route can access req.user
     */
    req.user = user;
    console.log(user);

    next(); // ALLOW REQUEST TO CONTINUE
  } catch (err) {
    console.error('AUTH ERROR:', err.message);

    return res.status(401).json({
      message: 'Not authorized, token failed',
    });
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
      return res.status(300).json({
        message: 'User not loaded before role check',
      });
    }

    console.log(req.user.role);

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden: You don't have permission",
      });
    }

    console.log(allowedRoles);

    next(); // ROLE ALLOWED
  };
};