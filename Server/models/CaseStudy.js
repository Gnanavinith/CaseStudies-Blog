const mongoose = require('mongoose');

const caseStudySchema = new mongoose.Schema({
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
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot be more than 100 characters']
  },
  industry: {
    type: String,
    required: [true, 'Industry is required'],
    enum: ['Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing', 'Education', 'Entertainment', 'Transportation', 'Real Estate', 'Other']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Marketing', 'Product Development', 'Business Strategy', 'Digital Transformation', 'Customer Experience', 'Operations', 'Innovation', 'Growth']
  },
  excerpt: {
    type: String,
    required: [true, 'Excerpt is required'],
    maxlength: [500, 'Excerpt cannot be more than 500 characters']
  },
  summary: {
    type: String,
    required: [true, 'Summary is required']
  },
  challenge: {
    type: String,
    required: [true, 'Challenge description is required']
  },
  solution: {
    type: String,
    required: [true, 'Solution description is required']
  },
  methodology: {
    type: String,
    required: [true, 'Methodology is required']
  },
  results: {
    type: String,
    required: [true, 'Results are required']
  },
  keyInsights: [{
    type: String,
    required: [true, 'Key insights are required']
  }],
  metrics: {
    revenue: {
      before: Number,
      after: Number,
      unit: {
        type: String,
        enum: ['USD', 'EUR', 'GBP', 'Other'],
        default: 'USD'
      }
    },
    users: {
      before: Number,
      after: Number
    },
    conversion: {
      before: Number,
      after: Number,
      unit: {
        type: String,
        enum: ['%', 'decimal'],
        default: '%'
      }
    },
    efficiency: {
      before: Number,
      after: Number,
      unit: String
    }
  },
  timeline: {
    startDate: Date,
    endDate: Date,
    duration: String
  },
  team: {
    size: Number,
    roles: [String]
  },
  budget: {
    amount: Number,
    currency: {
      type: String,
      enum: ['USD', 'EUR', 'GBP', 'Other'],
      default: 'USD'
    }
  },
  tools: [{
    name: String,
    category: String,
    description: String
  }],
  technologies: [String],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  featuredImage: {
    type: String,
    required: [true, 'Featured image is required']
  },
  images: [{
    url: String,
    caption: String,
    alt: String
  }],
  videos: [{
    url: String,
    title: String,
    description: String,
    duration: Number
  }],
  documents: [{
    name: String,
    url: String,
    type: String,
    size: Number
  }],
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot be more than 30 characters']
  }],
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate'
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
  featured: {
    type: Boolean,
    default: false
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
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
    downloads: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    }
  },
  relatedCaseStudies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CaseStudy'
  }],
  allowComments: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Generate slug from title before saving
caseStudySchema.pre('save', function(next) {
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
caseStudySchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Virtual for formatted read time
caseStudySchema.virtual('formattedReadTime').get(function() {
  return `${this.readTime} min read`;
});

// Virtual for ROI calculation
caseStudySchema.virtual('roi').get(function() {
  if (this.metrics.revenue && this.metrics.revenue.before && this.metrics.revenue.after) {
    const before = this.metrics.revenue.before;
    const after = this.metrics.revenue.after;
    return ((after - before) / before * 100).toFixed(2);
  }
  return null;
});

// Method to increment view count
caseStudySchema.methods.incrementViews = function() {
  this.engagement.views += 1;
  return this.save();
};

// Method to add bookmark
caseStudySchema.methods.addBookmark = function() {
  this.engagement.bookmarks += 1;
  return this.save();
};

// Method to add download
caseStudySchema.methods.addDownload = function() {
  this.engagement.downloads += 1;
  return this.save();
};

// Static method to get featured case studies
caseStudySchema.statics.getFeatured = function(limit = 6) {
  return this.find({ 
    status: 'published', 
    featured: true 
  })
  .populate('author', 'name avatar')
  .sort({ publishedAt: -1 })
  .limit(limit);
};

// Static method to get case studies by industry
caseStudySchema.statics.getByIndustry = function(industry, limit = 10) {
  return this.find({ 
    status: 'published', 
    industry: industry 
  })
  .populate('author', 'name avatar')
  .sort({ publishedAt: -1 })
  .limit(limit);
};

// Static method to get case studies by category
caseStudySchema.statics.getByCategory = function(category, limit = 10) {
  return this.find({ 
    status: 'published', 
    category: category 
  })
  .populate('author', 'name avatar')
  .sort({ publishedAt: -1 })
  .limit(limit);
};

// Static method to search case studies
caseStudySchema.statics.search = function(query, limit = 20) {
  return this.find({
    status: 'published',
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { company: { $regex: query, $options: 'i' } },
      { excerpt: { $regex: query, $options: 'i' } },
      { summary: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } }
    ]
  })
  .populate('author', 'name avatar')
  .sort({ publishedAt: -1 })
  .limit(limit);
};

// Indexes for better query performance
caseStudySchema.index({ slug: 1 });
caseStudySchema.index({ status: 1, publishedAt: -1 });
caseStudySchema.index({ industry: 1, status: 1 });
caseStudySchema.index({ category: 1, status: 1 });
caseStudySchema.index({ company: 1 });
caseStudySchema.index({ author: 1, status: 1 });
caseStudySchema.index({ tags: 1 });
caseStudySchema.index({ featured: 1, status: 1 });
caseStudySchema.index({ difficulty: 1 });
caseStudySchema.index({ 'engagement.views': -1 });
caseStudySchema.index({ title: 'text', excerpt: 'text', summary: 'text' });

// Ensure virtuals are included when converting to JSON
caseStudySchema.set('toJSON', { virtuals: true });
caseStudySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('CaseStudy', caseStudySchema);
