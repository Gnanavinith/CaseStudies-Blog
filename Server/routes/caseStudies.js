const express = require('express');
const { body, validationResult, query } = require('express-validator');
const CaseStudy = require('../models/CaseStudy');
const User = require('../models/User');

const router = express.Router();

// Middleware to verify JWT token (for protected routes)
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

// @route   GET /api/case-studies
// @desc    Get all published case studies with pagination and filtering
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('industry').optional().isIn(['Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing', 'Education', 'Entertainment', 'Transportation', 'Real Estate', 'Other']),
  query('category').optional().isIn(['Marketing', 'Product Development', 'Business Strategy', 'Digital Transformation', 'Customer Experience', 'Operations', 'Innovation', 'Growth']),
  query('difficulty').optional().isIn(['Beginner', 'Intermediate', 'Advanced']),
  query('search').optional().trim().isLength({ min: 2 }).withMessage('Search query must be at least 2 characters'),
  query('sort').optional().isIn(['newest', 'oldest', 'popular', 'featured']).withMessage('Invalid sort option')
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
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = { status: 'published' };
    
    if (req.query.industry) {
      query.industry = req.query.industry;
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.difficulty) {
      query.difficulty = req.query.difficulty;
    }

    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { company: { $regex: req.query.search, $options: 'i' } },
        { excerpt: { $regex: req.query.search, $options: 'i' } },
        { summary: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search, 'i')] } }
      ];
    }

    // Build sort
    let sort = {};
    switch (req.query.sort) {
      case 'oldest':
        sort = { publishedAt: 1 };
        break;
      case 'popular':
        sort = { 'engagement.views': -1 };
        break;
      case 'featured':
        sort = { featured: -1, publishedAt: -1 };
        break;
      default: // newest
        sort = { publishedAt: -1 };
    }

    // Execute query
    const caseStudies = await CaseStudy.find(query)
      .populate('author', 'name avatar')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await CaseStudy.countDocuments(query);

    res.json({
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
    console.error('Get case studies error:', error);
    res.status(500).json({ message: 'Server error while fetching case studies' });
  }
});

// @route   GET /api/case-studies/featured
// @desc    Get featured case studies
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const caseStudies = await CaseStudy.getFeatured(limit);
    
    res.json({ caseStudies });
  } catch (error) {
    console.error('Get featured case studies error:', error);
    res.status(500).json({ message: 'Server error while fetching featured case studies' });
  }
});

// @route   GET /api/case-studies/industry/:industry
// @desc    Get case studies by industry
// @access  Public
router.get('/industry/:industry', [
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

    const { industry } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    // Validate industry
    const validIndustries = ['Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing', 'Education', 'Entertainment', 'Transportation', 'Real Estate', 'Other'];
    if (!validIndustries.includes(industry)) {
      return res.status(400).json({ message: 'Invalid industry' });
    }

    const caseStudies = await CaseStudy.getByIndustry(industry, limit);
    
    res.json({ caseStudies });
  } catch (error) {
    console.error('Get case studies by industry error:', error);
    res.status(500).json({ message: 'Server error while fetching case studies by industry' });
  }
});

// @route   GET /api/case-studies/category/:category
// @desc    Get case studies by category
// @access  Public
router.get('/category/:category', [
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

    const { category } = req.params;
    const limit = parseInt(req.query.limit) || 10;

    // Validate category
    const validCategories = ['Marketing', 'Product Development', 'Business Strategy', 'Digital Transformation', 'Customer Experience', 'Operations', 'Innovation', 'Growth'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const caseStudies = await CaseStudy.getByCategory(category, limit);
    
    res.json({ caseStudies });
  } catch (error) {
    console.error('Get case studies by category error:', error);
    res.status(500).json({ message: 'Server error while fetching case studies by category' });
  }
});

// @route   GET /api/case-studies/search
// @desc    Search case studies
// @access  Public
router.get('/search', [
  query('q').trim().isLength({ min: 2 }).withMessage('Search query must be at least 2 characters'),
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

    const { q: query } = req.query;
    const limit = parseInt(req.query.limit) || 20;

    const caseStudies = await CaseStudy.search(query, limit);
    
    res.json({ caseStudies, query });
  } catch (error) {
    console.error('Search case studies error:', error);
    res.status(500).json({ message: 'Server error while searching case studies' });
  }
});

// @route   GET /api/case-studies/:slug
// @desc    Get case study by slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const caseStudy = await CaseStudy.findOne({ 
      slug, 
      status: 'published' 
    }).populate('author', 'name avatar bio company position');

    if (!caseStudy) {
      return res.status(404).json({ message: 'Case study not found' });
    }

    // Increment view count
    await caseStudy.incrementViews();

    res.json({ caseStudy });
  } catch (error) {
    console.error('Get case study by slug error:', error);
    res.status(500).json({ message: 'Server error while fetching case study' });
  }
});

// @route   POST /api/case-studies
// @desc    Create a new case study (requires authentication)
// @access  Private
router.post('/', auth, [
  body('title').trim().isLength({ min: 10, max: 200 }).withMessage('Title must be between 10 and 200 characters'),
  body('company').trim().isLength({ min: 2, max: 100 }).withMessage('Company name must be between 2 and 100 characters'),
  body('industry').isIn(['Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing', 'Education', 'Entertainment', 'Transportation', 'Real Estate', 'Other']).withMessage('Invalid industry'),
  body('category').isIn(['Marketing', 'Product Development', 'Business Strategy', 'Digital Transformation', 'Customer Experience', 'Operations', 'Innovation', 'Growth']).withMessage('Invalid category'),
  body('excerpt').trim().isLength({ min: 50, max: 500 }).withMessage('Excerpt must be between 50 and 500 characters'),
  body('summary').trim().isLength({ min: 100 }).withMessage('Summary must be at least 100 characters'),
  body('challenge').trim().isLength({ min: 50 }).withMessage('Challenge description must be at least 50 characters'),
  body('solution').trim().isLength({ min: 50 }).withMessage('Solution description must be at least 50 characters'),
  body('methodology').trim().isLength({ min: 50 }).withMessage('Methodology must be at least 50 characters'),
  body('results').trim().isLength({ min: 50 }).withMessage('Results must be at least 50 characters'),
  body('keyInsights').isArray({ min: 1 }).withMessage('At least one key insight is required'),
  body('featuredImage').trim().isURL().withMessage('Featured image must be a valid URL'),
  body('readTime').isInt({ min: 1 }).withMessage('Read time must be at least 1 minute')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array() 
      });
    }

    const caseStudyData = {
      ...req.body,
      author: req.user._id,
      status: 'draft' // Default to draft
    };

    const caseStudy = new CaseStudy(caseStudyData);
    await caseStudy.save();

    const populatedCaseStudy = await caseStudy.populate('author', 'name avatar');

    res.status(201).json({
      message: 'Case study created successfully',
      caseStudy: populatedCaseStudy
    });

  } catch (error) {
    console.error('Create case study error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A case study with this title already exists' });
    }
    res.status(500).json({ message: 'Server error while creating case study' });
  }
});

// @route   PUT /api/case-studies/:id
// @desc    Update a case study (requires authentication and ownership)
// @access  Private
router.put('/:id', auth, [
  body('title').optional().trim().isLength({ min: 10, max: 200 }).withMessage('Title must be between 10 and 200 characters'),
  body('excerpt').optional().trim().isLength({ min: 50, max: 500 }).withMessage('Excerpt must be between 50 and 500 characters'),
  body('summary').optional().trim().isLength({ min: 100 }).withMessage('Summary must be at least 100 characters'),
  body('status').optional().isIn(['draft', 'published', 'archived']).withMessage('Invalid status')
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

    // Find case study and check ownership
    const caseStudy = await CaseStudy.findById(id);
    if (!caseStudy) {
      return res.status(404).json({ message: 'Case study not found' });
    }

    if (caseStudy.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this case study' });
    }

    // Update case study
    const updatedCaseStudy = await CaseStudy.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'name avatar');

    res.json({
      message: 'Case study updated successfully',
      caseStudy: updatedCaseStudy
    });

  } catch (error) {
    console.error('Update case study error:', error);
    res.status(500).json({ message: 'Server error while updating case study' });
  }
});

// @route   DELETE /api/case-studies/:id
// @desc    Delete a case study (requires authentication and ownership)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Find case study and check ownership
    const caseStudy = await CaseStudy.findById(id);
    if (!caseStudy) {
      return res.status(404).json({ message: 'Case study not found' });
    }

    if (caseStudy.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this case study' });
    }

    await CaseStudy.findByIdAndDelete(id);

    res.json({ message: 'Case study deleted successfully' });

  } catch (error) {
    console.error('Delete case study error:', error);
    res.status(500).json({ message: 'Server error while deleting case study' });
  }
});

// @route   POST /api/case-studies/:id/like
// @desc    Like/unlike a case study
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const caseStudy = await CaseStudy.findById(id);
    if (!caseStudy) {
      return res.status(404).json({ message: 'Case study not found' });
    }

    // Toggle like (in a real app, you'd track individual user likes)
    await caseStudy.toggleLike();

    res.json({ 
      message: 'Case study liked successfully',
      likes: caseStudy.engagement.likes
    });

  } catch (error) {
    console.error('Like case study error:', error);
    res.status(500).json({ message: 'Server error while liking case study' });
  }
});

// @route   POST /api/case-studies/:id/bookmark
// @desc    Bookmark a case study
// @access  Private
router.post('/:id/bookmark', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const caseStudy = await CaseStudy.findById(id);
    if (!caseStudy) {
      return res.status(404).json({ message: 'Case study not found' });
    }

    // Add bookmark
    await caseStudy.addBookmark();

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.caseStudiesRead': 1 }
    });

    res.json({ 
      message: 'Case study bookmarked successfully',
      bookmarks: caseStudy.engagement.bookmarks
    });

  } catch (error) {
    console.error('Bookmark case study error:', error);
    res.status(500).json({ message: 'Server error while bookmarking case study' });
  }
});

// @route   POST /api/case-studies/:id/download
// @desc    Download a case study
// @access  Private
router.post('/:id/download', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const caseStudy = await CaseStudy.findById(id);
    if (!caseStudy) {
      return res.status(404).json({ message: 'Case study not found' });
    }

    // Add download
    await caseStudy.addDownload();

    res.json({ 
      message: 'Case study download recorded successfully',
      downloads: caseStudy.engagement.downloads
    });

  } catch (error) {
    console.error('Download case study error:', error);
    res.status(500).json({ message: 'Server error while recording download' });
  }
});

module.exports = router;
