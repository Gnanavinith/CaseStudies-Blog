const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Blog = require('../models/Blog');
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

// @route   GET /api/blogs
// @desc    Get all published blogs with pagination and filtering
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('category').optional().isIn(['Technology', 'Marketing', 'Business', 'Design', 'Startups', 'Finance', 'Healthcare', 'Education']),
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
    
    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { excerpt: { $regex: req.query.search, $options: 'i' } },
        { content: { $regex: req.query.search, $options: 'i' } },
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
    const blogs = await Blog.find(query)
      .populate('author', 'name avatar')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Blog.countDocuments(query);

    res.json({
      blogs,
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
    console.error('Get blogs error:', error);
    res.status(500).json({ message: 'Server error while fetching blogs' });
  }
});

// @route   GET /api/blogs/featured
// @desc    Get featured blogs
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const blogs = await Blog.getFeatured(limit);
    
    res.json({ blogs });
  } catch (error) {
    console.error('Get featured blogs error:', error);
    res.status(500).json({ message: 'Server error while fetching featured blogs' });
  }
});

// @route   GET /api/blogs/category/:category
// @desc    Get blogs by category
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
    const validCategories = ['Technology', 'Marketing', 'Business', 'Design', 'Startups', 'Finance', 'Healthcare', 'Education'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const blogs = await Blog.getByCategory(category, limit);
    
    res.json({ blogs });
  } catch (error) {
    console.error('Get blogs by category error:', error);
    res.status(500).json({ message: 'Server error while fetching blogs by category' });
  }
});

// @route   GET /api/blogs/search
// @desc    Search blogs
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

    const blogs = await Blog.search(query, limit);
    
    res.json({ blogs, query });
  } catch (error) {
    console.error('Search blogs error:', error);
    res.status(500).json({ message: 'Server error while searching blogs' });
  }
});

// @route   GET /api/blogs/:slug
// @desc    Get blog by slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({ 
      slug, 
      status: 'published' 
    }).populate('author', 'name avatar bio company position');

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Increment view count
    await blog.incrementViews();

    res.json({ blog });
  } catch (error) {
    console.error('Get blog by slug error:', error);
    res.status(500).json({ message: 'Server error while fetching blog' });
  }
});

// @route   POST /api/blogs
// @desc    Create a new blog (requires authentication)
// @access  Private
router.post('/', auth, [
  body('title').trim().isLength({ min: 10, max: 200 }).withMessage('Title must be between 10 and 200 characters'),
  body('excerpt').trim().isLength({ min: 50, max: 500 }).withMessage('Excerpt must be between 50 and 500 characters'),
  body('content').trim().isLength({ min: 100 }).withMessage('Content must be at least 100 characters'),
  body('category').isIn(['Technology', 'Marketing', 'Business', 'Design', 'Startups', 'Finance', 'Healthcare', 'Education']).withMessage('Invalid category'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
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

    const blogData = {
      ...req.body,
      author: req.user._id,
      status: 'draft' // Default to draft
    };

    const blog = new Blog(blogData);
    await blog.save();

    const populatedBlog = await blog.populate('author', 'name avatar');

    res.status(201).json({
      message: 'Blog created successfully',
      blog: populatedBlog
    });

  } catch (error) {
    console.error('Create blog error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A blog with this title already exists' });
    }
    res.status(500).json({ message: 'Server error while creating blog' });
  }
});

// @route   PUT /api/blogs/:id
// @desc    Update a blog (requires authentication and ownership)
// @access  Private
router.put('/:id', auth, [
  body('title').optional().trim().isLength({ min: 10, max: 200 }).withMessage('Title must be between 10 and 200 characters'),
  body('excerpt').optional().trim().isLength({ min: 50, max: 500 }).withMessage('Excerpt must be between 50 and 500 characters'),
  body('content').optional().trim().isLength({ min: 100 }).withMessage('Content must be at least 100 characters'),
  body('category').optional().isIn(['Technology', 'Marketing', 'Business', 'Design', 'Startups', 'Finance', 'Healthcare', 'Education']).withMessage('Invalid category'),
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

    // Find blog and check ownership
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this blog' });
    }

    // Update blog
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'name avatar');

    res.json({
      message: 'Blog updated successfully',
      blog: updatedBlog
    });

  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ message: 'Server error while updating blog' });
  }
});

// @route   DELETE /api/blogs/:id
// @desc    Delete a blog (requires authentication and ownership)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Find blog and check ownership
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this blog' });
    }

    await Blog.findByIdAndDelete(id);

    res.json({ message: 'Blog deleted successfully' });

  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ message: 'Server error while deleting blog' });
  }
});

// @route   POST /api/blogs/:id/like
// @desc    Like/unlike a blog
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Toggle like (in a real app, you'd track individual user likes)
    await blog.toggleLike();

    res.json({ 
      message: 'Blog liked successfully',
      likes: blog.engagement.likes
    });

  } catch (error) {
    console.error('Like blog error:', error);
    res.status(500).json({ message: 'Server error while liking blog' });
  }
});

// @route   POST /api/blogs/:id/bookmark
// @desc    Bookmark a blog
// @access  Private
router.post('/:id/bookmark', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Add bookmark
    await blog.addBookmark();

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.bookmarks': 1 }
    });

    res.json({ 
      message: 'Blog bookmarked successfully',
      bookmarks: blog.engagement.bookmarks
    });

  } catch (error) {
    console.error('Bookmark blog error:', error);
    res.status(500).json({ message: 'Server error while bookmarking blog' });
  }
});

module.exports = router;
