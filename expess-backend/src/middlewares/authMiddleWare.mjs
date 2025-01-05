import { CODES } from '../utils/const.mjs';
import { verifyToken } from '../utils/helper.mjs';

// Middleware to authenticate user
export const authMiddleWare = (req, res, next) => {
  const token =
    req.cookies.token || req.headers['Authorization']?.split(' ')[1]; // Get token from cookies or headers
  if (!token)
    return res.status(CODES.ACCESS_DENIED).json({ message: 'No token found' });

  try {
    const user = verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    res.status(CODES.BAD_REQUEST).json({ message: 'Invalid Token', error });
  }
};
