import jwt from 'jsonwebtoken';

// Generate JWT Access Token
export const generateAccessToken = (user) => {
  return jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });
};

// Generate JWT Refresh Token
export const generateRefreshToken = (user) => {
  return jwt.sign(
    { _id: user._id, email: user.email },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

// Verify token
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};
