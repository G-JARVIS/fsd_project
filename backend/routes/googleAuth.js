import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
import { google } from 'googleapis';

const router = express.Router();

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

function createOAuthClient() {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_OAUTH_REDIRECT // e.g. http://localhost:5001/api/google/callback
  );
  return client;
}

// Return a URL for the user to visit to authorize the app
router.get('/url', protect, async (req, res) => {
  try {
    const oauth2Client = createOAuthClient();
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent',
      state: req.user._id.toString(),
    });
    res.json({ url: authUrl });
  } catch (error) {
    console.error('Google URL error', error);
    res.status(500).json({ message: 'Failed to generate Google auth URL' });
  }
});

// Callback end-point that Google will redirect to (use in Google Console)
// This route expects `code` and `state` (state is userId)
router.get('/callback', async (req, res) => {
  const { code, state } = req.query;
  if (!code || !state) return res.status(400).send('Missing code or state');

  try {
    const oauth2Client = createOAuthClient();
    const { tokens } = await oauth2Client.getToken(code);

    const userId = state;
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');

    // Save refresh token and access token
    user.google = user.google || {};
    if (tokens.refresh_token) user.google.refreshToken = tokens.refresh_token;
    if (tokens.access_token) user.google.accessToken = tokens.access_token;
    if (tokens.expiry_date) user.google.tokenExpiry = new Date(tokens.expiry_date);
    user.google.calendarConnected = true;
    await user.save();

    // Redirect back to frontend with success
    const redirect = process.env.FRONTEND_URL || 'http://localhost:5173';
    return res.redirect(`${redirect}/settings?google=connected`);
  } catch (error) {
    console.error('Google callback error', error);
    return res.status(500).send('Google callback failed');
  }
});

// Disconnect Google account
router.post('/disconnect', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.google = { calendarConnected: false };
    await user.save();
    res.json({ message: 'Google disconnected' });
  } catch (error) {
    console.error('Google disconnect error', error);
    res.status(500).json({ message: 'Failed to disconnect' });
  }
});

export default router;
