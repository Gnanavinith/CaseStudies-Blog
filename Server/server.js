const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const config = require('./config');
require('dotenv').config();

const app = express();
const PORT = config.port;

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(cors({
  origin: config.frontendUrl,
  credentials: true
}));
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection with better error handling
mongoose.connect(config.mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB successfully');
  console.log(`📊 Database: ${config.mongodbUri}`);
  console.log(`🔗 Connection state: ${mongoose.connection.readyState}`);
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  console.error('❌ Connection details:', {
    uri: config.mongodbUri,
    error: err.message,
    code: err.code
  });
  process.exit(1);
});

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
  console.error('❌ Connection state:', mongoose.connection.readyState);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
  console.log('⚠️  Connection state:', mongoose.connection.readyState);
});

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected');
  console.log('✅ Connection state:', mongoose.connection.readyState);
});

// Add middleware to check MongoDB connection before processing requests
app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    console.error('❌ MongoDB not connected. Ready state:', mongoose.connection.readyState);
    return res.status(503).json({ 
      message: 'Database connection not available',
      error: 'MongoDB connection lost'
    });
  }
  next();
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during MongoDB connection closure:', err);
    process.exit(1);
  }
});

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Case Studies & Blogs API is running!',
    version: '1.0.0',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Import routes
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');
const caseStudyRoutes = require('./routes/caseStudies');
const userRoutes = require('./routes/users');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/case-studies', caseStudyRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: config.nodeEnv === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`🔗 Frontend URL: ${config.frontendUrl}`);
  console.log(`📅 Started at: ${new Date().toISOString()}`);
});

module.exports = app;
