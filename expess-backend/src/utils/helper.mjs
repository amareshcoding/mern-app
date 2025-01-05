import jwt from 'jsonwebtoken';
import { CODES, MESSAGES } from './const.mjs';

//------------------------JWT------------------------//
// Generate JWT Access Token
export const generateAccessToken = (user) => {
  return jwt.sign(
    { _id: user._id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: '15m',
    }
  );
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

// ------------------------ SERVER RESPONSE------------------------//
// Create Server Response
export const serverResponse = (res, code, message, body) => {
  return res.status(code).json({ message, body });
};

export const internalServerErrorResponse = (res, error) => {
  return res
    .status(CODES.INTERNAL_SERVER_ERROR)
    .json({ message: MESSAGES.SOMTHING_WENT_WRONG, error });
};
