import { CODES } from '../utils/const.mjs';
import { verifyAccessToken } from '../utils/helper.mjs';

// Middleware to authenticate user
export const authMiddleWare = (req, res, next) => {

  const token = req.headers['authorization']?.split(' ')[1];
  if (!token)
    return res.status(CODES.ACCESS_DENIED).json({ message: 'No token found' });

  try {
    const user = verifyAccessToken(token);
    req.user = user;
    next();
  } catch (error) {
    res.status(CODES.BAD_REQUEST).json({ message: 'Invalid Token', error });
  }
};
