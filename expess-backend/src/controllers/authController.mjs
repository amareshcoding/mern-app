import jwt from 'jsonwebtoken';
import User from '../models/userModel.mjs';

// Generate tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { email: user.email, id: user._id },
    'access_secret',
    { expiresIn: '15m' }
  );
  const refreshToken = jwt.sign(
    { email: user.email, id: user._id },
    'refresh_secret',
    { expiresIn: '7d' }
  );
  return { accessToken, refreshToken };
};

// Refresh token controller
export const refreshToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(403).json({ message: 'Refresh token is required' });
  }

  try {
    const decoded = jwt.verify(token, 'refresh_secret');
    const existingUser = await User.findById(decoded.id);

    if (!existingUser) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const tokens = generateTokens(existingUser);
    res.status(200).json(tokens);
  } catch (error) {
    res.status(403).json({ message: 'Invalid refresh token' });
  }
};

// Signup controller
export const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    const tokens = generateTokens(newUser);
    res.status(201).json({ result: newUser, ...tokens });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Login controller
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordCorrect = existingUser.verifyPassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const tokens = generateTokens(existingUser);
    res.status(200).json({ result: existingUser, ...tokens });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Password reset controller
export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user's password
    existingUser.password = newPassword;
    await existingUser.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};
