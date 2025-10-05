// routes/protected.js
const express = require('express');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.get('/profile', authenticate, (req, res) => {
  res.json({
    message: 'This is your protected profile data',
    user: req.user
  });
});

router.get('/dashboard', authenticate, (req, res) => {
  res.json({
    message: 'Welcome to your dashboard!',
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;