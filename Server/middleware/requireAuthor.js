// Middleware to check if user has author role
const requireAuthor = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'Authentication required',
        error: 'User not authenticated'
      });
    }

    if (req.user.role !== 'author') {
      return res.status(403).json({
        message: 'Access denied',
        error: 'Author role required to create content'
      });
    }

    console.log('✅ Author access granted for:', req.user.email);
    next();
  } catch (error) {
    console.error('❌ Author middleware error:', error);
    res.status(500).json({
      message: 'Authorization check failed',
      error: 'Server error during authorization'
    });
  }
};

module.exports = requireAuthor;
