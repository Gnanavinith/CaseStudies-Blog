const express = require('express');
const { body, validationResult } = require('express-validator');
const CaseStudy = require('../models/CaseStudy');
const auth = require('../middleware/auth');
const requireAuthor = require('../middleware/requireAuthor');

const router = express.Router();

// @route   GET /api/case-studies
// @desc    Get all published case studies
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, page = 1, limit = 10, search } = req.query;
    
    let query = { status: 'published' };
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }
    
    const skip = (page - 1) * limit;
    
    const caseStudies = await CaseStudy.find(query)
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await CaseStudy.countDocuments(query);
    
    res.json({
      caseStudies,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        total,
        hasNext: skip + caseStudies.length < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching case studies:', error);
    res.status(500).json({ message: 'Server error while fetching case studies' });
  }
});

// @route   GET /api/case-studies/:slug
// @desc    Get case study by slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findOne({ 
      slug: req.params.slug, 
      status: 'published' 
    }).populate('author', 'name avatar');
    
    if (!caseStudy) {
      return res.status(404).json({ message: 'Case study not found' });
    }
    
    // Increment view count
    caseStudy.views += 1;
    await caseStudy.save();
    
    res.json({ caseStudy });
  } catch (error) {
    console.error('Error fetching case study:', error);
    res.status(500).json({ message: 'Server error while fetching case study' });
  }
});

// @route   POST /api/case-studies
// @desc    Create a new case study
// @access  Private (Author only)
router.post('/', [auth, requireAuthor], [
  body('title').trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('description').trim().isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters'),
  body('content').trim().isLength({ min: 50 }).withMessage('Content must be at least 50 characters'),
  body('category').isIn(['web-apps', 'mobile-apps', 'windows-apps', 'digital-marketing', 'ad-shoot']).withMessage('Invalid category'),
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

    const { title, description, content, category, tags } = req.body;
    
    // Process tags
    const processedTags = tags ? tags.filter(tag => tag.trim().length > 0) : [];
    
    // Create case study
    const caseStudy = new CaseStudy({
      title,
      description,
      content,
      category,
      tags: processedTags,
      author: req.user._id,
      authorName: req.user.name
    });
    
    await caseStudy.save();
    
    // Populate author info for response
    await caseStudy.populate('author', 'name avatar');
    
    res.status(201).json({
      message: 'Case study created successfully',
      caseStudy
    });
    
  } catch (error) {
    console.error('Error creating case study:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'A case study with this title already exists' 
      });
    }
    
    res.status(500).json({ message: 'Server error while creating case study' });
  }
});

// @route   PUT /api/case-studies/:id
// @desc    Update a case study
// @access  Private (Author only)
router.put('/:id', [auth, requireAuthor], [
  body('title').optional().trim().isLength({ min: 5, max: 200 }).withMessage('Title must be between 5 and 200 characters'),
  body('description').optional().trim().isLength({ min: 10, max: 500 }).withMessage('Description must be between 10 and 500 characters'),
  body('content').optional().trim().isLength({ min: 50 }).withMessage('Content must be at least 50 characters'),
  body('category').optional().isIn(['web-apps', 'mobile-apps', 'windows-apps', 'digital-marketing', 'ad-shoot']).withMessage('Invalid category'),
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

    const caseStudy = await CaseStudy.findById(req.params.id);
    
    if (!caseStudy) {
      return res.status(404).json({ message: 'Case study not found' });
    }
    
    // Check if user is the author
    if (caseStudy.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this case study' });
    }
    
    const updates = req.body;
    
    // Process tags if provided
    if (updates.tags) {
      updates.tags = updates.tags.filter(tag => tag.trim().length > 0);
    }
    
    const updatedCaseStudy = await CaseStudy.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('author', 'name avatar');
    
    res.json({
      message: 'Case study updated successfully',
      caseStudy: updatedCaseStudy
    });
    
  } catch (error) {
    console.error('Error updating case study:', error);
    res.status(500).json({ message: 'Server error while updating case study' });
  }
});

// @route   DELETE /api/case-studies/:id
// @desc    Delete a case study
// @access  Private (Author only)
router.delete('/:id', [auth, requireAuthor], async (req, res) => {
  try {
    const caseStudy = await CaseStudy.findById(req.params.id);
    
    if (!caseStudy) {
      return res.status(404).json({ message: 'Case study not found' });
    }
    
    // Check if user is the author
    if (caseStudy.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this case study' });
    }
    
    await CaseStudy.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Case study deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting case study:', error);
    res.status(500).json({ message: 'Server error while deleting case study' });
  }
});

module.exports = router;
