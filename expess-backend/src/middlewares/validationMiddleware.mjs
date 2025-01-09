import { validationResult } from 'express-validator';
import { CODES } from '../utils/const.mjs';

// Handle validation errors
export const handleValidationError = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(CODES.BAD_REQUEST).json({ errors: errors.array() });
  }
  next();
};
