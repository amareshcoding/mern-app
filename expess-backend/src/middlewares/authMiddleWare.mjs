import { verifyToken } from '../utils/helper.mjs';

// Middleware to authenticate user
export const authMiddleWare = (req, res, next) => {
  const token =
    req.cookies.token || req.headers['Authorization']?.split(' ')[1]; // Get token from cookies or headers
  if (!token) return res.status(401).json({ message: 'Access Denied' });

  try {
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};
