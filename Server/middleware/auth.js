const jwt = require('jsonwebtoken');
const User = require('../models/User');

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

module.exports = auth;
