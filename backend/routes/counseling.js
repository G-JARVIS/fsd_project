import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import CounsellingSession from '../models/CounsellingSession.js';
import CounsellingApplication from '../models/CounsellingApplication.js';

const router = express.Router();

// @desc    Get all counselling sessions (for students to view available sessions)
// @route   GET /api/counseling/sessions
// @access  Private
router.get('/sessions', protect, async (req, res) => {
  try {
    const { upcoming = true, page = 1, limit = 10 } = req.query;
    
    let query = { isActive: true };
    
    if (upcoming === 'true') {
      query.date = { $gte: new Date() };
      query.status = 'scheduled';
    }

    const sessions = await CounsellingSession.find(query)
      .sort({ date: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await CounsellingSession.countDocuments(query);

    res.json({
      sessions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get counselling sessions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Apply for counselling session
// @route   POST /api/counseling/sessions/:id/apply
// @access  Private
router.post('/sessions/:id/apply', protect, async (req, res) => {
  try {
    const { reason, urgency, previousCounselling, notes } = req.body;
    
    const session = await CounsellingSession.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ message: 'Counselling session not found' });
    }

    if (!session.isActive || session.status !== 'scheduled') {
      return res.status(400).json({ message: 'Session is not available for applications' });
    }

    // Check if already applied
    const existingApplication = await CounsellingApplication.findOne({
      userId: req.user._id,
      sessionId: session._id
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied for this counselling session' });
    }

    // Check if session is full
    const currentApplications = await CounsellingApplication.countDocuments({
      sessionId: session._id,
      status: { $in: ['applied', 'confirmed'] }
    });

    if (currentApplications >= session.maxParticipants) {
      return res.status(400).json({ message: 'Session is full' });
    }

    const application = await CounsellingApplication.create({
      userId: req.user._id,
      sessionId: session._id,
      reason,
      urgency: urgency || 'medium',
      previousCounselling: previousCounselling || false,
      notes
    });

    await application.populate('sessionId', 'counsellorName topic date time');

    res.status(201).json(application);
  } catch (error) {
    console.error('Apply for counselling error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get user's counselling applications
// @route   GET /api/counseling/my-applications
// @access  Private
router.get('/my-applications', protect, async (req, res) => {
  try {
    const applications = await CounsellingApplication.find({ userId: req.user._id })
      .populate('sessionId', 'counsellorName topic date time location status')
      .sort({ appliedDate: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Get user counselling applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Cancel counselling application
// @route   PUT /api/counseling/applications/:id/cancel
// @access  Private
router.put('/applications/:id/cancel', protect, async (req, res) => {
  try {
    const application = await CounsellingApplication.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.status === 'completed' || application.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot cancel this application' });
    }

    application.status = 'cancelled';
    application.updates.push({
      status: 'cancelled',
      date: new Date(),
      notes: 'Cancelled by student',
      updatedBy: 'student'
    });

    await application.save();

    res.json({ message: 'Application cancelled successfully', application });
  } catch (error) {
    console.error('Cancel counselling application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Submit feedback for completed session
// @route   PUT /api/counseling/applications/:id/feedback
// @access  Private
router.put('/applications/:id/feedback', protect, async (req, res) => {
  try {
    const { rating, comments } = req.body;
    
    const application = await CounsellingApplication.findOne({
      _id: req.params.id,
      userId: req.user._id,
      status: 'completed'
    });

    if (!application) {
      return res.status(404).json({ message: 'Completed application not found' });
    }

    application.feedback = {
      rating,
      comments,
      submittedAt: new Date()
    };

    await application.save();

    res.json({ message: 'Feedback submitted successfully', application });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN ROUTES

// @desc    Create counselling session (Admin only)
// @route   POST /api/counseling/admin/sessions
// @access  Private/Admin
router.post('/admin/sessions', protect, adminOnly, async (req, res) => {
  try {
    const { 
      counsellorName, 
      topic, 
      date, 
      time, 
      duration, 
      location, 
      description, 
      maxParticipants, 
      sessionType 
    } = req.body;

    const session = await CounsellingSession.create({
      counsellorName,
      topic,
      date,
      time,
      duration: duration || 60,
      location: location || 'Counselling Room',
      description,
      maxParticipants: maxParticipants || 1,
      sessionType: sessionType || 'individual'
    });

    res.status(201).json(session);
  } catch (error) {
    console.error('Create counselling session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get all counselling sessions (Admin)
// @route   GET /api/counseling/admin/sessions
// @access  Private/Admin
router.get('/admin/sessions', protect, adminOnly, async (req, res) => {
  try {
    const sessions = await CounsellingSession.find()
      .sort({ date: -1 });

    res.json(sessions);
  } catch (error) {
    console.error('Get all counselling sessions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update counselling session (Admin)
// @route   PUT /api/counseling/admin/sessions/:id
// @access  Private/Admin
router.put('/admin/sessions/:id', protect, adminOnly, async (req, res) => {
  try {
    const session = await CounsellingSession.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    console.error('Update counselling session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete counselling session (Admin)
// @route   DELETE /api/counseling/admin/sessions/:id
// @access  Private/Admin
router.delete('/admin/sessions/:id', protect, adminOnly, async (req, res) => {
  try {
    const session = await CounsellingSession.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Delete counselling session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get all counselling applications (Admin)
// @route   GET /api/counseling/admin/applications
// @access  Private/Admin
router.get('/admin/applications', protect, adminOnly, async (req, res) => {
  try {
    const { sessionId, status } = req.query;
    
    let query = {};
    
    if (sessionId) {
      query.sessionId = sessionId;
    }
    
    if (status) {
      query.status = status;
    }

    const applications = await CounsellingApplication.find(query)
      .populate('userId', 'name email profile.branch profile.yearOfStudy')
      .populate('sessionId', 'counsellorName topic date time')
      .sort({ appliedDate: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Get counselling applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update counselling application status (Admin)
// @route   PUT /api/counseling/admin/applications/:id
// @access  Private/Admin
router.put('/admin/applications/:id', protect, adminOnly, async (req, res) => {
  try {
    const { status, counsellorNotes } = req.body;
    
    const application = await CounsellingApplication.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (status) application.status = status;
    if (counsellorNotes) application.counsellorNotes = counsellorNotes;

    application.updates.push({
      status: status || application.status,
      date: new Date(),
      notes: counsellorNotes || `Status updated to ${status}`,
      updatedBy: 'admin'
    });

    await application.save();
    
    await application.populate('userId', 'name email profile.branch profile.yearOfStudy');
    await application.populate('sessionId', 'counsellorName topic date time');

    res.json(application);
  } catch (error) {
    console.error('Update counselling application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;