// middleware/isAdmin.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET;

const isAdmin = async (req, res, next) => {
  // Get the token from the authorization header
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if the user has admin privileges in the payload
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    // Attach user info to the request and proceed
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = isAdmin;
