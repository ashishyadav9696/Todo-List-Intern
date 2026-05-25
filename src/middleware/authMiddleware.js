const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'internSpark_secret_key_2026';

/**
 * Protect routes – verify JWT token from Authorization header
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized – no token provided'));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      res.status(401);
      return next(new Error('Not authorized – user no longer exists'));
    }

    next();
  } catch (error) {
    res.status(401);
    next(new Error('Not authorized – token is invalid or expired'));
  }
};

module.exports = { protect };
