const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    console.log('🔐 Auth middleware - checking request headers');
    
    const authHeader = req.header('Authorization');
    console.log('🔐 Authorization header:', authHeader);
    
    if (!authHeader) {
      console.log('❌ No Authorization header found');
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('🔐 Token extracted:', token ? `${token.substring(0, 20)}...` : 'undefined');
    
    if (!token) {
      console.log('❌ No token found after Bearer removal');
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      console.log('🔐 JWT verified successfully, userId:', decoded.userId);
    } catch (jwtError) {
      console.error('❌ JWT verification failed:', jwtError.message);
      return res.status(401).json({ 
        message: 'Invalid token.',
        error: 'JWT verification failed'
      });
    }

    if (!decoded.userId) {
      console.log('❌ No userId in decoded token');
      return res.status(401).json({ 
        message: 'Invalid token.',
        error: 'Token does not contain user ID'
      });
    }

    // Find user in database
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      console.log('❌ User not found in database for userId:', decoded.userId);
      return res.status(401).json({ 
        message: 'Invalid token.',
        error: 'User not found in database'
      });
    }

    console.log('✅ User authenticated successfully:', user.email);
    
    // Set user in request object
    req.user = user;
    next();
    
  } catch (error) {
    console.error('❌ Auth middleware error:', error);
    console.error('❌ Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    res.status(401).json({ 
      message: 'Invalid token.',
      error: 'Authentication failed'
    });
  }
};

// Middleware to check if user has author role
const requireAuthor = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Authentication required',
        error: 'User not authenticated'
      });
    }

    if (req.user.role !== 'author') {
      return res.status(403).json({ 
        message: 'Access denied',
        error: 'Author role required to create content'
      });
    }

    console.log('✅ Author access granted for:', req.user.email);
    next();
  } catch (error) {
    console.error('❌ Author middleware error:', error);
    res.status(500).json({ 
      message: 'Authorization check failed',
      error: 'Server error during authorization'
    });
  }
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  })
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Determine user role based on email
    let userRole = 'user'; // default role
    if (email === 'hellotanglome@gmail.com') {
      userRole = 'author';
      console.log('🎭 Assigning author role to:', email);
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      role: userRole
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (without password) and token
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Ensure specific user has author role
    if (email === 'hellotanglome@gmail.com' && user.role !== 'author') {
      user.role = 'author';
      await user.save();
      console.log('🎭 Updated user role to author for:', email);
    }

    // Update last active
    user.stats.lastActive = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      user: req.user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('bio').optional().isLength({ max: 500 }).withMessage('Bio cannot be more than 500 characters'),
  body('company').optional().isLength({ max: 100 }).withMessage('Company name cannot be more than 100 characters'),
  body('position').optional().isLength({ max: 100 }).withMessage('Position cannot be more than 100 characters'),
  body('website').optional().isURL().withMessage('Please provide a valid URL')
], async (req, res) => {
  try {
    // Debug: Check if req.user exists and has required properties
    if (!req.user || !req.user._id) {
      console.error('❌ req.user is missing or invalid:', req.user);
      return res.status(401).json({ 
        message: 'User authentication failed',
        error: 'req.user is missing or invalid'
      });
    }

    console.log('🔍 Profile update request received:', {
      userId: req.user._id,
      userEmail: req.user.email,
      body: req.body,
      user: req.user
    });

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const updates = req.body;
    const allowedUpdates = ['name', 'bio', 'company', 'position', 'website', 'socialLinks', 'preferences'];
    
    console.log('📝 Allowed updates:', allowedUpdates);
    console.log('📝 Requested updates:', updates);
    
    // Filter out invalid fields
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});

    console.log('✅ Filtered updates:', filteredUpdates);

    // Validate that we have at least one field to update
    if (Object.keys(filteredUpdates).length === 0) {
      console.log('❌ No valid fields to update');
      return res.status(400).json({ 
        message: 'No valid fields to update',
        error: 'All provided fields were filtered out'
      });
    }

    // Check if user exists in database
    const existingUser = await User.findById(req.user._id);
    if (!existingUser) {
      console.log('❌ User not found in database:', req.user._id);
      return res.status(404).json({ 
        message: 'User not found in database',
        error: 'User ID from token does not exist in database'
      });
    }

    console.log('✅ User found in database:', existingUser.email);

    // Update user with better error handling
    let updatedUser;
    try {
      updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        filteredUpdates,
        { 
          new: true, 
          runValidators: true,
          upsert: false // Don't create if doesn't exist
        }
      ).select('-password');
    } catch (updateError) {
      console.error('❌ MongoDB update error:', updateError);
      if (updateError.name === 'ValidationError') {
        return res.status(400).json({ 
          message: 'Validation failed during update',
          error: updateError.message
        });
      }
      throw updateError; // Re-throw to be caught by outer catch
    }

    if (!updatedUser) {
      console.log('❌ User update failed - no user returned');
      return res.status(404).json({ 
        message: 'User update failed',
        error: 'No user returned after update operation'
      });
    }

    console.log('✅ User updated successfully:', updatedUser.email);
    console.log('📝 Updated fields:', Object.keys(filteredUpdates));

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('❌ Profile update error:', error);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    // Handle specific MongoDB errors
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'Invalid user ID format',
        error: 'The user ID provided is not valid'
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Data validation failed',
        error: error.message
      });
    }
    
    // Send more detailed error in development
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? `Profile update failed: ${error.message}` 
      : 'Server error while updating profile';
    
    res.status(500).json({ 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/auth/password
// @desc    Change password
// @access  Private
router.put('/password', auth, [
  body('currentPassword').exists().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Password confirmation does not match new password');
    }
    return true;
  })
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ message: 'Server error while changing password' });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not
      return res.json({ message: 'If an account with that email exists, a password reset link has been sent' });
    }

    // Generate reset token (in production, send email)
    const resetToken = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // In production, send email here
    console.log('Password reset token:', resetToken);

    res.json({ message: 'If an account with that email exists, a password reset link has been sent' });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error while processing password reset' });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', [
  body('token').exists().withMessage('Reset token is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Password confirmation does not match new password');
    }
    return true;
  })
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { token, newPassword } = req.body;

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find user with valid reset token
    const user = await User.findOne({
      _id: decoded.userId,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update password and clear reset token
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });

  } catch (error) {
    console.error('Reset password error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: 'Invalid reset token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Reset token has expired' });
    }
    res.status(500).json({ message: 'Server error while resetting password' });
  }
});

// @route   GET /api/auth/test
// @desc    Test endpoint to verify server is working
// @access  Public
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Auth route is working!',
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path
  });
});

// @route   GET /api/auth/test-auth
// @desc    Test endpoint to verify auth middleware is working
// @access  Private
router.get('/test-auth', auth, (req, res) => {
  res.json({ 
    message: 'Auth middleware is working!',
    user: {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
