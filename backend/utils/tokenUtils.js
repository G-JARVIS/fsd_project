// utils/tokenUtils.js
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.ACCESS_TOKEN_SECRET, 
    { expiresIn: '15m' } // Short-lived access token
  );
};

const generateRefreshToken = () => {
  // Generate a cryptographically secure random string
  return crypto.randomBytes(40).toString('hex');
};

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken
};