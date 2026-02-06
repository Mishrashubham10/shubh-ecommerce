import jwt from 'jsonwebtoken';

/**
 * GENERATE ACCESS TOKEN (JWT)
 */
export const generateAccessToken = (user) => {
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
 * GENERATE REFRESH TOKEN (JWT)
 */
export const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString('hex');
};