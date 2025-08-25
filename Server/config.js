// Configuration file for the server
module.exports = {
  // Server Configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database Configuration
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/case-studies-blog',

  // JWT Configuration
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  // File Upload Configuration
  maxFileSize: process.env.MAX_FILE_SIZE || 5242880, // 5MB
  allowedFileTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || [
    'image/jpeg',
    'image/png', 
    'image/gif',
    'application/pdf'
  ],

  // Rate Limiting
  rateLimitWindowMs: process.env.RATE_LIMIT_WINDOW_MS || 900000, // 15 minutes
  rateLimitMaxRequests: process.env.RATE_LIMIT_MAX_REQUESTS || 100,

  // Email Configuration (for password reset)
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    user: process.env.SMTP_USER || 'your-email@gmail.com',
    pass: process.env.SMTP_PASS || 'your-app-password'
  },

  // Frontend URL (for CORS)
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
};
