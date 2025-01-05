import { Router } from 'express';
import { check } from 'express-validator';
import {
  login,
  logout,
  register,
  resetPassword,
  token,
} from '../controllers/authController.mjs';
import { authMiddleWare } from '../middlewares/authMiddleWare.mjs';
import { handleValidationError } from '../middlewares/validationMiddleware.mjs';

const authRouther = Router();

// Register a new user
authRouther.post(
  '/register',
  [
    // Validation rules
    check('firstName')
      .isString()
      .withMessage('First name must be a string')
      .notEmpty()
      .withMessage('First name is required')
      .isLength({ min: 3, max: 50 })
      .withMessage('First name must be between 3 and 50 characters'),

    check('lastName')
      .isString()
      .withMessage('Last name must be a string')
      .isLength({ max: 50 })
      .withMessage('Last name must be max 50 characters'),

    check('email')
      .isEmail()
      .withMessage('Invalid email address')
      .notEmpty()
      .withMessage('Email is required'),

    check('password')
      .isString()
      .withMessage('Password must be a string')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    // later we can add custom validation to check for strong password
  ],
  handleValidationError,
  register
);

// Login a user
authRouther.post(
  '/login',
  [
    check('email')
      .isEmail()
      .withMessage('Invalid email address')
      .notEmpty()
      .withMessage('Email is required'),

    check('password')
      .isString()
      .withMessage('Password must be a string')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ],
  handleValidationError,
  login
);

// Refresh the access token
authRouther.post('/token', authMiddleWare, token);

// Reset the user's password
authRouther.post('/resetPassword', authMiddleWare, resetPassword);

// Logout a user
authRouther.post('/logout', authMiddleWare, logout);

export default authRouther;
