import { validationResult } from 'express-validator';
import User from '../models/userModel.mjs';
import { CONST } from '../utils/const.mjs';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from '../utils/helper.mjs';

// Register controller
export const register = async (req, res) => {
  // Handle validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(CONST.CODES.BAD_REQUEST).json({ errors: errors.array() });
  }

  // Extract user data from request body
  const { firstName, lastName, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(CONST.CODES.BAD_REQUEST)
        .json({ message: 'User already exists' });
    }

    // Create a new user
    await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    // Send response
    res
      .status(CONST.CODES.CREATED)
      .json({ message: 'User created successfully!' });
  } catch (error) {
    res
      .status(CONST.CODES.INTERNAL_SERVER_ERROR)
      .json({ message: 'Something went wrong!', error });
  }
};

// Login controller - Verify Password  And Generates Access and Refresh Tokens
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Validate user
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Email or password is wrong' });

    // Validate password
    const isPasswordCorrect = user.verifyPassword(password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: 'Invalid credentials' });

    // Generate tokens
    const refreshToken = generateRefreshToken(user);
    const accessToken = generateAccessToken(user);

    // Store refresh token in cookies
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });

    // Send response
    res.json({
      message: 'Logged in successfully',
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      accessToken,
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Token Refresh Route
export const token = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: 'No refresh token found' });

  try {
    // Verify refresh token
    const { id } = verifyToken(refreshToken);
    // Find user by ID
    const user = await User.findById(id);
    // Generate a new access token
    const accessToken = generateAccessToken(user);
    // Send the new access token
    res.status(200).json({ accessToken });
  } catch (err) {
    res.status(400).json({ message: 'Invalid refresh token' });
  }
};

// Password reset controller
export const resetPassword = async (req, res) => {
  const { userId, newPassword } = req.body;

  try {
    // Find the user by ID
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user's password
    existingUser.password = newPassword;
    await existingUser.save();

    // Generate tokens
    const refreshToken = generateRefreshToken(existingUser);
    const accessToken = generateAccessToken(existingUser);

    // Store refresh token in cookies
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });

    res.status(200).json({ message: 'Password reset successful', accessToken });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Logout controller
export const logout = async (req, res) => {
  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'Logged out successfully' });
};
