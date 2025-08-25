const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  excerpt: {
    type: String,
    required: [true, 'Excerpt is required'],
    maxlength: [500, 'Excerpt cannot be more than 500 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Technology', 'Marketing', 'Business', 'Design', 'Startups', 'Finance', 'Healthcare', 'Education']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot be more than 30 characters']
  }],
  featuredImage: {
    type: String,
    required: [true, 'Featured image is required']
  },
  readTime: {
    type: Number,
    required: [true, 'Read time is required'],
    min: [1, 'Read time must be at least 1 minute']
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: {
    type: Date,
    default: null
  },
  seo: {
    metaTitle: {
      type: String,
      maxlength: [60, 'Meta title cannot be more than 60 characters']
    },
    metaDescription: {
      type: String,
      maxlength: [160, 'Meta description cannot be more than 160 characters']
    },
    keywords: [String]
  },
  engagement: {
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    bookmarks: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    }
  },
  featured: {
    type: Boolean,
    default: false
  },
  allowComments: {
    type: Boolean,
    default: true
  },
  relatedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }]
}, {
  timestamps: true
});

// Generate slug from title before saving
blogSchema.pre('save', function(next) {
  if (!this.isModified('title')) return next();
  
  this.slug = this.title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
  
  next();
});

// Set publishedAt when status changes to published
blogSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Virtual for formatted read time
blogSchema.virtual('formattedReadTime').get(function() {
  return `${this.readTime} min read`;
});

// Virtual for reading progress (if user is logged in)
blogSchema.virtual('readingProgress').get(function() {
  // This would be calculated based on user's reading progress
  return 0;
});

// Method to increment view count
blogSchema.methods.incrementViews = function() {
  this.engagement.views += 1;
  return this.save();
};

// Method to toggle like
blogSchema.methods.toggleLike = function() {
  this.engagement.likes += 1;
  return this.save();
};

// Method to add bookmark
blogSchema.methods.addBookmark = function() {
  this.engagement.bookmarks += 1;
  return this.save();
};

// Static method to get featured posts
blogSchema.statics.getFeatured = function(limit = 6) {
  return this.find({ 
    status: 'published', 
    featured: true 
  })
  .populate('author', 'name avatar')
  .sort({ publishedAt: -1 })
  .limit(limit);
};

// Static method to get posts by category
blogSchema.statics.getByCategory = function(category, limit = 10) {
  return this.find({ 
    status: 'published', 
    category: category 
  })
  .populate('author', 'name avatar')
  .sort({ publishedAt: -1 })
  .limit(limit);
};

// Static method to search posts
blogSchema.statics.search = function(query, limit = 20) {
  return this.find({
    status: 'published',
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { excerpt: { $regex: query, $options: 'i' } },
      { content: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ]
  })
  .populate('author', 'name avatar')
  .sort({ publishedAt: -1 })
  .limit(limit);
};

// Indexes for better query performance
blogSchema.index({ slug: 1 });
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ category: 1, status: 1 });
blogSchema.index({ author: 1, status: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ featured: 1, status: 1 });
blogSchema.index({ 'engagement.views': -1 });
blogSchema.index({ title: 'text', excerpt: 'text', content: 'text' });

// Ensure virtuals are included when converting to JSON
blogSchema.set('toJSON', { virtuals: true });
blogSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Blog', blogSchema);
