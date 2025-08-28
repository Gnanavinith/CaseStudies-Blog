const express = require('express');
const { body, validationResult } = require('express-validator');
const Blog = require('../models/Blog');
const auth = require('../middleware/auth');
const requireAuthor = require('../middleware/requireAuthor');

const router = express.Router();

// @route   GET /api/blogs
// @desc    Get all published blog posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, tag } = req.query;
    
    let query = { status: 'published' };
    
    // Filter by tag
    if (tag) {
      query.tags = { $in: [tag] };
    }
    
    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }
    
    const skip = (page - 1) * limit;
    
    const blogs = await Blog.find(query)
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Blog.countDocuments(query);
    
    res.json({
      blogs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        total,
        hasNext: skip + blogs.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: 'Server error while fetching blogs' });
  }
});

// @route   GET /api/blogs/:slug
// @desc    Get blog post by slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ 
      slug: req.params.slug, 
      status: 'published' 
    }).populate('author', 'name avatar');
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    // Increment view count
    blog.views += 1;
    await blog.save();
    
    res.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ message: 'Server error while fetching blog' });
  }
});

// @route   POST /api/blogs
// @desc    Create a new blog post
// @access  Private (Author only)
router.post('/', [auth, requireAuthor], [
  body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('description').trim().isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters'),
  body('content').trim().isLength({ min: 50 }).withMessage('Content must be at least 50 characters'),
  body('tags').optional().isArray().withMessage('Tags must be an array')
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

    const { title, description, content, tags } = req.body;
    
    // Process tags
    const processedTags = tags ? tags.filter(tag => tag.trim().length > 0) : [];
    
    // Create blog post
    const blog = new Blog({
      title,
      description,
      content,
      tags: processedTags,
      author: req.user._id,
      authorName: req.user.name
    });
    
    await blog.save();
    
    // Populate author info for response
    await blog.populate('author', 'name avatar');
    
    res.status(201).json({
      message: 'Blog post created successfully',
      blog
    });
    
  } catch (error) {
    console.error('Error creating blog post:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'A blog post with this title already exists' 
      });
    }
    
    res.status(500).json({ message: 'Server error while creating blog post' });
  }
});

// @route   PUT /api/blogs/:id
// @desc    Update a blog post
// @access  Private (Author only)
router.put('/:id', [auth, requireAuthor], [
  body('title').optional().trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('description').optional().trim().isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters'),
  body('content').optional().trim().isLength({ min: 50 }).withMessage('Content must be at least 50 characters'),
  body('tags').optional().isArray().withMessage('Tags must be an array')
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

    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    // Check if user is the author
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this blog post' });
    }
    
    const updates = req.body;
    
    // Process tags if provided
    if (updates.tags) {
      updates.tags = updates.tags.filter(tag => tag.trim().length > 0);
    }
    
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('author', 'name avatar');
    
    res.json({
      message: 'Blog post updated successfully',
      blog: updatedBlog
    });
    
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ message: 'Server error while updating blog post' });
  }
});

// @route   DELETE /api/blogs/:id
// @desc    Delete a blog post
// @access  Private (Author only)
router.delete('/:id', [auth, requireAuthor], async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    // Check if user is the author
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this blog post' });
    }
    
    await Blog.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Blog post deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ message: 'Server error while deleting blog post' });
  }
});

module.exports = router;
