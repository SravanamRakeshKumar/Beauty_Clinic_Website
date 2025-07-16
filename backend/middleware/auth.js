// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// User Authentication Middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password'); // use 'id' instead of 'userId'

    if (!user) {
      return res.status(401).json({ message: 'Invalid token or user not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Admin Authorization Middleware
const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, async () => {
      if (!req.user?.isAdmin) {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
      }
      next();
    });
  } catch (error) {
    console.error('Admin Auth error:', error.message);
    res.status(403).json({ message: 'Admin authorization failed' });
  }
};

module.exports = { auth, adminAuth };
