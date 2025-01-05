import { CODES } from '../utils/const.mjs';
import User from '../models/userModel.mjs';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  internalServerErrorResponse,
} from '../utils/helper.mjs';

// Register controller
export const register = async (req, res) => {
  // Extract user data from request body
  const { firstName, lastName, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(CODES.BAD_REQUEST)
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
    res.status(CODES.CREATED).json({ message: 'User created successfully!' });
  } catch (error) {
    return internalServerErrorResponse(res, error);
  }
};

// Login controller - Verify Password  And Generates Access and Refresh Tokens
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Validate user
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(CODES.BAD_REQUEST)
        .json({ message: 'Email or password is wrong' });

    // Validate password
    const isPasswordCorrect = await user.verifyPassword(password);
    if (!isPasswordCorrect)
      return res
        .status(CODES.BAD_REQUEST)
        .json({ message: 'Invalid credentials' });

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
    res.status(CODES.OK).json({
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
    return internalServerErrorResponse(res, error);
  }
};

// Token Refresh Route
export const token = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res
      .status(CODES.ACCESS_DENIED)
      .json({ message: 'No refresh token found' });

  try {
    // Verify refresh token
    const { id } = verifyToken(refreshToken);
    // Find user by ID
    const user = await User.findById(id);
    // Generate a new access token
    const accessToken = generateAccessToken(user);
    // Send the new access token
    res.status(CODES.OK).json({ accessToken });
  } catch (error) {
    res
      .status(CODES.BAD_REQUEST)
      .json({ message: 'Invalid refresh token', error });
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
    return internalServerErrorResponse(res, error);
  }
};

// Logout controller
export const logout = async (req, res) => {
  res.clearCookie('refreshToken');
  res.status(200).json({ message: 'Logged out successfully' });
};
