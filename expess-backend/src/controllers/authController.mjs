import jwt from 'jsonwebtoken';
import User from '../models/userModel.mjs';
import { CONST } from '../utils/const.mjs';

// Generate JWT Access Token
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });
};

// Generate JWT Refresh Token
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

// Generate tokens
const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

// Signup controller
export const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(CONST.CODES.BAD_REQUEST)
        .json({ message: 'User already exists' });
    }

    await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    res
      .status(CONST.CODES.CREATED)
      .json({ message: 'User created successfully!' });
  } catch (error) {
    res
      .status(CONST.CODES.INTERNAL_SERVER_ERROR)
      .json({ message: 'Something went wrong!' });
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
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

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
    const { id } = verifyRefreshToken(refreshToken);
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
    const accessToken = generateAccessToken(existingUser);
    const refreshToken = generateRefreshToken(existingUser);

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
