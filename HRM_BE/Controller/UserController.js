const User = require('../Models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register User
const register = async (req, res) => {
    console.log("Request body:", req.body);
  const { fullName, email, password } = req.body;

  // Input validation
  if (!fullName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required',
    });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    const user = await User.create({ fullName, email, password });

  

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
      message: 'User registered successfully',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

 
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both email and password',
    });
  }

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    setToken(user, 200, res);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Set Token Function
const setToken = (user, statusCode, res) => {
  const authToken = user.getJwtToken();
  const refreshToken = user.getJwtRefreshToken();

  const accessExpireMs = parseInt(process.env.COOKIE_EXPIRE, 10) * 24 * 60 * 60 * 1000;
  const refreshExpireMs = parseInt(process.env.JWT_REFRESH_EXPIRE, 10) * 24 * 60 * 60 * 1000;

  const options = {
    httpOnly: true,
    expires: new Date(Date.now() + accessExpireMs),
  };

  const refreshOptions = {
    httpOnly: true,
    sameSite: 'Strict',
    expires: new Date(Date.now() + refreshExpireMs),
  };

  res
    .status(statusCode)
    .cookie('auth_token', authToken, options)
    .cookie('refresh_token', refreshToken, refreshOptions)
    .json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
      authToken,
      refreshToken,
      message: 'Logged in successfully',
    });
};

module.exports = {
  register,
  loginUser,
};
