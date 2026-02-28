import jwt from 'jsonwebtoken';
import { randomBytes, randomUUID, createHash } from 'node:crypto';

/**
 * GENERATE ACCESS TOKEN (JWT)
 */
export const generateAccessToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '15m' },
  );
};

/**
 * GENERATE REFRESH TOKEN
 * (Better stored in DB)
 */
export const generateRefreshToken = () => {
  return randomUUID(); // good for opaque token strategy
};

/**
 * GENERATE PASSWORD RESET TOKEN
 */
export const generatePasswordResetToken = () => {
  const rawToken = randomBytes(32).toString('hex');

  const hashedToken = createHash('sha256').update(rawToken).digest('hex');

  return {
    rawToken, // send via email
    hashedToken, // store in DB
  };
};