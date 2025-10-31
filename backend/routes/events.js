import express from 'express';
import { protect } from '../middleware/auth.js';
import Event from '../models/Event.js';
import { google } from 'googleapis';
import User from '../models/User.js';

const router = express.Router();

// @desc    Get all events
// @route   GET /api/events
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { type, upcoming = true, page = 1, limit = 10 } = req.query;
    
    let query = { isActive: true };
    
    if (type) {
      query.type = type;
    }

    if (upcoming === 'true') {
      query.date = { $gte: new Date() };
      query.status = 'scheduled';
    }

    const events = await Event.find(query)
      .sort({ date: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Event.countDocuments(query);

    res.json({
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get user's events (including auto-created placement events)
// @route   GET /api/events/my-events
// @access  Private
router.get('/my-events', protect, async (req, res) => {
  try {
    const { type, upcoming = true, page = 1, limit = 50 } = req.query;
    
    let query = { 
      isActive: true,
      $or: [
        { 'attendees.userId': req.user._id },
        { 'metadata.applicationId': { $exists: true } }
      ]
    };
    
    if (type) {
      query.type = type;
    }

    if (upcoming === 'true') {
      query.date = { $gte: new Date() };
      query.status = 'scheduled';
    }

    const events = await Event.find(query)
      .populate('metadata.driveId', 'company role')
      .populate('metadata.applicationId', 'status currentStage')
      .sort({ date: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Filter events to only include those where user is an attendee or has the application
    const userEvents = events.filter(event => {
      // Check if user is in attendees
      const isAttendee = event.attendees.some(attendee => 
        attendee.userId.toString() === req.user._id.toString()
      );
      
      // Check if this is user's placement event (through application)
      const isUserApplication = event.metadata?.applicationId && 
        event.metadata.applicationId.userId?.toString() === req.user._id.toString();
      
      return isAttendee || isUserApplication;
    });

    const total = userEvents.length;

    res.json({
      events: userEvents,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get user events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create new event
// @route   POST /api/events
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, type, startTime, endTime, time, location, description, organizer, maxAttendees } = req.body;

    if (!title || !type || !startTime) {
      return res.status(400).json({ message: 'Title, type and startTime are required' });
    }

    const date = new Date(startTime);
    const timeStr = time || (endTime ? `${new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    const event = await Event.create({
      title,
      type,
      date,
      time: timeStr,
      location,
      description,
      organizer: organizer || req.user?.name || 'Organizer',
      maxAttendees: maxAttendees || null,
      attendees: [],
      status: 'scheduled',
      isActive: true
    });

    // If frontend requested adding to Google and user has connected Google, try to insert
    try {
      if (req.body.addToGoogle && req.user) {
        const user = await User.findById(req.user._id);
        if (user?.google?.refreshToken) {
          const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_OAUTH_REDIRECT
          );

          oauth2Client.setCredentials({ refresh_token: user.google.refreshToken });

          // refresh access token if needed
          try {
            const tokenResponse = await oauth2Client.getAccessToken();
            if (tokenResponse?.token) {
              oauth2Client.setCredentials({ access_token: tokenResponse.token });
            }
          } catch (e) {
            console.warn('Failed to refresh Google access token', e);
          }

          const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
          const gEvent = {
            summary: title,
            description: description,
            start: { dateTime: new Date(startTime).toISOString() },
            end: { dateTime: new Date(endTime || startTime).toISOString() },
            location,
          };

          try {
            const inserted = await calendar.events.insert({ calendarId: 'primary', resource: gEvent });
            // store google event id on backend event if needed
            if (inserted && inserted.data && inserted.data.id) {
              event.googleEventId = inserted.data.id;
              await event.save();
            }
          } catch (err) {
            console.warn('Failed to insert event to Google Calendar', err);
          }
        }
      }
    } catch (e) {
      console.error('Google sync error', e);
    }

    res.status(201).json({ event });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const updates = req.body;
    if (updates.startTime) {
      updates.date = new Date(updates.startTime);
      delete updates.startTime;
    }

    Object.assign(event, updates);
    await event.save();
    res.json({ event });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete / deactivate an event
// @route   DELETE /api/events/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // soft delete
    event.isActive = false;
    await event.save();

    res.json({ message: 'Event removed' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Register for event
// @route   POST /api/events/:id/register
// @access  Private
router.post('/:id/register', protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if already registered
    const alreadyRegistered = event.attendees.some(
      attendee => attendee.userId.toString() === req.user._id.toString()
    );

    if (alreadyRegistered) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    // Check if event is full
    if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
      return res.status(400).json({ message: 'Event is full' });
    }

    event.attendees.push({
      userId: req.user._id,
      status: 'registered'
    });

    await event.save();

    res.json({ message: 'Successfully registered for event', event });
  } catch (error) {
    console.error('Register for event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;