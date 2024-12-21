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

// Generate JWT Access Token
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
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

    // Store refresh token in database (optional)
    user.refreshToken = refreshToken;
    await user.save();

    // Store refresh token in cookies (httpOnly for security)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
    });
    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
    });

    res.json({
      message: 'Logged in successfully',
      user: {
        userName: user.userName,
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
    const user = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET); // Verify refresh token
    const newAccessToken = generateAccessToken(user); // Generate a new access token

    res.cookie('token', newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
    });

    res.status(200).json({ message: 'Access token refreshed' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid refresh token' });
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
