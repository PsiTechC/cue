// routes/admin.js
const express = require('express');
const User = require('../models/User'); // Adjust the path based on your folder structure
const isAdmin = require('../middleware/isAdmin'); // Middleware to check admin access

const router = express.Router();

// Admin-only endpoint to get all users
router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

module.exports = router;
