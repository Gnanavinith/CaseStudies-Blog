const express = require('express');
const { body, validationResult, query } = require('express-validator');
const User = require('../models/User');
const Blog = require('../models/Blog');
const CaseStudy = require('../models/CaseStudy');

const router = express.Router();

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

// Middleware to check if user is admin
const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    res.json({
      user: req.user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update current user profile
// @access  Private
router.put('/profile', auth, [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('bio').optional().isLength({ max: 500 }).withMessage('Bio cannot be more than 500 characters'),
  body('company').optional().isLength({ max: 100 }).withMessage('Company name cannot be more than 100 characters'),
  body('position').optional().isLength({ max: 100 }).withMessage('Position cannot be more than 100 characters'),
  body('website').optional().isURL().withMessage('Please provide a valid URL'),
  body('socialLinks.linkedin').optional().isURL().withMessage('LinkedIn must be a valid URL'),
  body('socialLinks.twitter').optional().isURL().withMessage('Twitter must be a valid URL'),
  body('socialLinks.github').optional().isURL().withMessage('GitHub must be a valid URL'),
  body('preferences.categories').optional().isArray().withMessage('Categories must be an array'),
  body('preferences.newsletter').optional().isBoolean().withMessage('Newsletter preference must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const updates = req.body;
    const allowedUpdates = ['name', 'bio', 'company', 'position', 'website', 'socialLinks', 'preferences'];
    
    // Filter out invalid fields
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      filteredUpdates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
});

// @route   GET /api/users/stats
// @desc    Get current user statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    // Get user's content statistics
    const blogCount = await Blog.countDocuments({ author: req.user._id });
    const caseStudyCount = await CaseStudy.countDocuments({ author: req.user._id });
    
    // Get user's reading statistics
    const user = await User.findById(req.user._id).select('stats');
    
    const stats = {
      content: {
        blogs: blogCount,
        caseStudies: caseStudyCount,
        total: blogCount + caseStudyCount
      },
      reading: user.stats,
      engagement: {
        totalViews: 0, // Would be calculated from user's content
        totalLikes: 0,
        totalBookmarks: 0
      }
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error while fetching statistics' });
  }
});

// @route   GET /api/users/content
// @desc    Get current user's content (blogs and case studies)
// @access  Private
router.get('/content', auth, [
  query('type').optional().isIn(['blogs', 'case-studies', 'all']).withMessage('Type must be blogs, case-studies, or all'),
  query('status').optional().isIn(['draft', 'published', 'archived']).withMessage('Invalid status'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const type = req.query.type || 'all';
    const status = req.query.status;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let blogs = [];
    let caseStudies = [];
    let totalBlogs = 0;
    let totalCaseStudies = 0;

    // Build query
    const query = { author: req.user._id };
    if (status) {
      query.status = status;
    }

    if (type === 'blogs' || type === 'all') {
      totalBlogs = await Blog.countDocuments(query);
      blogs = await Blog.find(query)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit);
    }

    if (type === 'case-studies' || type === 'all') {
      totalCaseStudies = await CaseStudy.countDocuments(query);
      caseStudies = await CaseStudy.find(query)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit);
    }

    const total = totalBlogs + totalCaseStudies;

    res.json({
      blogs,
      caseStudies,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Get user content error:', error);
    res.status(500).json({ message: 'Server error while fetching user content' });
  }
});

// @route   GET /api/users/bookmarks
// @desc    Get current user's bookmarks
// @access  Private
router.get('/bookmarks', auth, [
  query('type').optional().isIn(['blogs', 'case-studies', 'all']).withMessage('Type must be blogs, case-studies, or all'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const type = req.query.type || 'all';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // In a real app, you'd have a separate Bookmark model
    // For now, we'll return empty arrays
    const bookmarks = {
      blogs: [],
      caseStudies: []
    };

    res.json({
      bookmarks,
      pagination: {
        currentPage: page,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: limit,
        hasNextPage: false,
        hasPrevPage: false
      }
    });

  } catch (error) {
    console.error('Get bookmarks error:', error);
    res.status(500).json({ message: 'Server error while fetching bookmarks' });
  }
});

// @route   GET /api/users/reading-history
// @desc    Get current user's reading history
// @access  Private
router.get('/reading-history', auth, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // In a real app, you'd have a separate ReadingHistory model
    // For now, we'll return empty arrays
    const readingHistory = {
      blogs: [],
      caseStudies: []
    };

    res.json({
      readingHistory,
      pagination: {
        currentPage: page,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: limit,
        hasNextPage: false,
        hasPrevPage: false
      }
    });

  } catch (error) {
    console.error('Get reading history error:', error);
    res.status(500).json({ message: 'Server error while fetching reading history' });
  }
});

// @route   PUT /api/users/avatar
// @desc    Update user avatar
// @access  Private
router.put('/avatar', auth, [
  body('avatar').trim().isURL().withMessage('Avatar must be a valid URL')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Avatar updated successfully',
      user
    });

  } catch (error) {
    console.error('Avatar update error:', error);
    res.status(500).json({ message: 'Server error while updating avatar' });
  }
});

// @route   DELETE /api/users/account
// @desc    Delete user account
// @access  Private
router.delete('/account', auth, async (req, res) => {
  try {
    // Delete user's content first
    await Blog.deleteMany({ author: req.user._id });
    await CaseStudy.deleteMany({ author: req.user._id });

    // Delete user account
    await User.findByIdAndDelete(req.user._id);

    res.json({ message: 'Account deleted successfully' });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Server error while deleting account' });
  }
});

// Admin routes
// @route   GET /api/users/admin/all
// @desc    Get all users (admin only)
// @access  Private (Admin)
router.get('/admin/all', adminAuth, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('role').optional().isIn(['user', 'admin', 'author']).withMessage('Invalid role'),
  query('search').optional().trim().isLength({ min: 2 }).withMessage('Search query must be at least 2 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    
    if (req.query.role) {
      query.role = req.query.role;
    }

    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { company: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Execute query
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
});

// @route   PUT /api/users/admin/:id/role
// @desc    Update user role (admin only)
// @access  Private (Admin)
router.put('/admin/:id/role', adminAuth, [
  body('role').isIn(['user', 'admin', 'author']).withMessage('Invalid role')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const { id } = req.params;
    const { role } = req.body;

    // Prevent admin from changing their own role
    if (id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot change your own role' });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User role updated successfully',
      user
    });

  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Server error while updating user role' });
  }
});

// @route   DELETE /api/users/admin/:id
// @desc    Delete user account (admin only)
// @access  Private (Admin)
router.delete('/admin/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting their own account
    if (id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user's content first
    await Blog.deleteMany({ author: id });
    await CaseStudy.deleteMany({ author: id });

    // Delete user account
    await User.findByIdAndDelete(id);

    res.json({ message: 'User account deleted successfully' });

  } catch (error) {
    console.error('Delete user account error:', error);
    res.status(500).json({ message: 'Server error while deleting user account' });
  }
});

module.exports = router;
