import express from 'express';
import User from '../models/User.js';
import Quiz from '../models/Quiz.js';
import CompanyDrive from '../models/CompanyDrive.js';
import Application from '../models/Application.js';
import Event from '../models/Event.js';
import CounsellingSession from '../models/CounsellingSession.js';
import CounsellingApplication from '../models/CounsellingApplication.js';
import JobRole from '../models/JobRole.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Apply protection and admin-only middleware to all routes
router.use(protect);
router.use(adminOnly);

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private/Admin
router.get('/students', async (req, res) => {
  try {
    const { search } = req.query;
    let query = { role: 'student' };
    
    if (search) {
      query = {
        ...query,
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    const students = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json(students);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get student by ID
// @route   GET /api/admin/students/:id
// @access  Private/Admin
router.get('/students/:id', async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select('-password');
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Get student's applications
    const applications = await Application.find({ userId: req.params.id })
      .populate('driveId', 'company role location package deadline')
      .populate('roleId', 'title company location package')
      .sort({ appliedDate: -1 });
    
    res.json({ student, applications });
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get all quizzes
// @route   GET /api/admin/quizzes
// @access  Private/Admin
router.get('/quizzes', async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create new quiz
// @route   POST /api/admin/quizzes
// @access  Private/Admin
router.post('/quizzes', async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json(quiz);
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(400).json({ message: 'Invalid quiz data' });
  }
});

// @desc    Update quiz
// @route   PUT /api/admin/quizzes/:id
// @access  Private/Admin
router.put('/quizzes/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    res.json(quiz);
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(400).json({ message: 'Invalid quiz data' });
  }
});

// @desc    Delete quiz
// @route   DELETE /api/admin/quizzes/:id
// @access  Private/Admin
router.delete('/quizzes/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get all company drives
// @route   GET /api/admin/drives
// @access  Private/Admin
router.get('/drives', async (req, res) => {
  try {
    const drives = await CompanyDrive.find().sort({ createdAt: -1 });
    res.json(drives);
  } catch (error) {
    console.error('Get drives error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create new company drive
// @route   POST /api/admin/drives
// @access  Private/Admin
router.post('/drives', async (req, res) => {
  try {
    const drive = await CompanyDrive.create(req.body);
    res.status(201).json(drive);
  } catch (error) {
    console.error('Create drive error:', error);
    res.status(400).json({ message: 'Invalid drive data' });
  }
});

// @desc    Update company drive
// @route   PUT /api/admin/drives/:id
// @access  Private/Admin
router.put('/drives/:id', async (req, res) => {
  try {
    const drive = await CompanyDrive.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }
    
    res.json(drive);
  } catch (error) {
    console.error('Update drive error:', error);
    res.status(400).json({ message: 'Invalid drive data' });
  }
});

// @desc    Delete company drive
// @route   DELETE /api/admin/drives/:id
// @access  Private/Admin
router.delete('/drives/:id', async (req, res) => {
  try {
    const drive = await CompanyDrive.findByIdAndDelete(req.params.id);
    
    if (!drive) {
      return res.status(404).json({ message: 'Drive not found' });
    }
    
    res.json({ message: 'Drive deleted successfully' });
  } catch (error) {
    console.error('Delete drive error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get drive applications
// @route   GET /api/admin/drives/:id/applications
// @access  Private/Admin
router.get('/drives/:id/applications', async (req, res) => {
  try {
    const applications = await Application.find({ driveId: req.params.id })
      .populate('userId', 'name email profile.branch profile.yearOfStudy profile.college')
      .sort({ appliedDate: -1 });
    
    res.json(applications);
  } catch (error) {
    console.error('Get drive applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Move application to next stage
// @route   PUT /api/admin/applications/:id/next-stage
// @access  Private/Admin
router.put('/applications/:id/next-stage', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('driveId');
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (!application.driveId) {
      return res.status(400).json({ message: 'Drive not found for this application' });
    }

    // Get the process stages from the drive
    const driveProcess = application.driveId.process || [];
    
    if (driveProcess.length === 0) {
      return res.status(400).json({ message: 'No process stages defined for this drive' });
    }

    const currentIndex = application.processStageIndex || 0;
    const nextIndex = Math.min(currentIndex + 1, driveProcess.length - 1);
    const nextStage = driveProcess[nextIndex];
    
    // Determine next step
    let nextStep = '';
    if (nextIndex < driveProcess.length - 1) {
      nextStep = `Prepare for ${driveProcess[nextIndex + 1]}`;
    } else {
      nextStep = 'Congratulations! You have completed all stages.';
    }

    // Determine status - only update to 'selected' if it's the final stage
    let status = application.status;
    if (nextIndex === driveProcess.length - 1) {
      status = 'selected';
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      {
        processStageIndex: nextIndex,
        currentStage: nextStage,
        nextStep,
        status,
        $push: {
          updates: {
            stage: nextStage,
            status,
            date: new Date(),
            notes: `Moved to next stage by admin`
          }
        }
      },
      { new: true, runValidators: true }
    ).populate('userId', 'name email profile.branch profile.yearOfStudy');

    // Update related calendar events to mark completed stages
    try {
      const relatedEvents = await Event.find({ 'metadata.applicationId': application._id });
      
      for (const event of relatedEvents) {
        const eventStageIndex = event.metadata?.stageIndex || 0;
        
        if (eventStageIndex < nextIndex) {
          // Mark past events as completed
          event.status = 'completed';
          if (!event.title.includes('[COMPLETED]')) {
            event.title = `[COMPLETED] ${event.title}`;
          }
          await event.save();
        } else if (eventStageIndex === nextIndex) {
          // Mark current stage event as ongoing
          event.status = 'ongoing';
          if (!event.title.includes('[CURRENT]')) {
            event.title = `[CURRENT] ${event.title}`;
          }
          await event.save();
        }
      }
    } catch (eventError) {
      console.error('Error updating related events:', eventError);
      // Don't fail the stage update if event update fails
    }
    
    res.json(updatedApplication);
  } catch (error) {
    console.error('Move to next stage error:', error);
    res.status(400).json({ message: 'Failed to move to next stage' });
  }
});

// @desc    Reject application
// @route   PUT /api/admin/applications/:id/reject
// @access  Private/Admin
router.put('/applications/:id/reject', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Update application status
    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      {
        status: 'rejected',
        nextStep: 'Application has been rejected',
        $push: {
          updates: {
            stage: application.currentStage || 'Application Review',
            status: 'rejected',
            date: new Date(),
            notes: 'Application rejected by admin'
          }
        }
      },
      { new: true, runValidators: true }
    ).populate('userId', 'name email profile.branch profile.yearOfStudy');

    // Cancel/update related calendar events
    try {
      await Event.updateMany(
        { 'metadata.applicationId': application._id },
        { 
          status: 'cancelled',
          title: { $regex: /^/, $options: 'i' }, // Keep existing title but we'll modify it
          $set: { 
            description: { $concat: ['[CANCELLED] ', '$description'] }
          }
        }
      );

      // Alternative approach - update each event individually to modify title
      const relatedEvents = await Event.find({ 'metadata.applicationId': application._id });
      for (const event of relatedEvents) {
        if (!event.title.startsWith('[CANCELLED]')) {
          event.title = `[CANCELLED] ${event.title}`;
          event.status = 'cancelled';
          event.description = `[CANCELLED] ${event.description || ''}`;
          await event.save();
        }
      }
    } catch (eventError) {
      console.error('Error updating related events:', eventError);
      // Don't fail the application rejection if event update fails
    }
    
    res.json(updatedApplication);
  } catch (error) {
    console.error('Reject application error:', error);
    res.status(400).json({ message: 'Failed to reject application' });
  }
});

// @desc    Update application stage (legacy endpoint for manual updates)
// @route   PUT /api/admin/applications/:id/stage
// @access  Private/Admin
router.put('/applications/:id/stage', async (req, res) => {
  try {
    const { processStageIndex, currentStage, nextStep, status } = req.body;
    
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      {
        processStageIndex,
        currentStage,
        nextStep,
        status,
        $push: {
          updates: {
            stage: currentStage,
            status,
            date: new Date(),
            notes: `Updated by admin to stage ${processStageIndex}`
          }
        }
      },
      { new: true, runValidators: true }
    ).populate('userId', 'name email profile.branch profile.yearOfStudy');
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    
    res.json(application);
  } catch (error) {
    console.error('Update application stage error:', error);
    res.status(400).json({ message: 'Invalid application data' });
  }
});

// @desc    Get all counselling sessions
// @route   GET /api/admin/counselling/sessions
// @access  Private/Admin
router.get('/counselling/sessions', async (req, res) => {
  try {
    const sessions = await CounsellingSession.find().sort({ date: -1 });
    res.json(sessions);
  } catch (error) {
    console.error('Get counselling sessions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create counselling session
// @route   POST /api/admin/counselling/sessions
// @access  Private/Admin
router.post('/counselling/sessions', async (req, res) => {
  try {
    const session = await CounsellingSession.create(req.body);
    res.status(201).json(session);
  } catch (error) {
    console.error('Create counselling session error:', error);
    res.status(400).json({ message: 'Invalid session data' });
  }
});

// @desc    Update counselling session
// @route   PUT /api/admin/counselling/sessions/:id
// @access  Private/Admin
router.put('/counselling/sessions/:id', async (req, res) => {
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
    res.status(400).json({ message: 'Invalid session data' });
  }
});

// @desc    Delete counselling session
// @route   DELETE /api/admin/counselling/sessions/:id
// @access  Private/Admin
router.delete('/counselling/sessions/:id', async (req, res) => {
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

// @desc    Get all counselling applications
// @route   GET /api/admin/counselling/applications
// @access  Private/Admin
router.get('/counselling/applications', async (req, res) => {
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

// @desc    Update counselling application status
// @route   PUT /api/admin/counselling/applications/:id
// @access  Private/Admin
router.put('/counselling/applications/:id', async (req, res) => {
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

// @desc    Get all job roles
// @route   GET /api/admin/roles
// @access  Private/Admin
router.get('/roles', async (req, res) => {
  try {
    const roles = await JobRole.find().sort({ createdAt: -1 });
    res.json(roles);
  } catch (error) {
    console.error('Get roles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create job role
// @route   POST /api/admin/roles
// @access  Private/Admin
router.post('/roles', async (req, res) => {
  try {
    const role = await JobRole.create(req.body);
    res.status(201).json(role);
  } catch (error) {
    console.error('Create role error:', error);
    res.status(400).json({ message: 'Invalid role data' });
  }
});

// @desc    Update job role
// @route   PUT /api/admin/roles/:id
// @access  Private/Admin
router.put('/roles/:id', async (req, res) => {
  try {
    const role = await JobRole.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    
    res.json(role);
  } catch (error) {
    console.error('Update role error:', error);
    res.status(400).json({ message: 'Invalid role data' });
  }
});

// @desc    Delete job role
// @route   DELETE /api/admin/roles/:id
// @access  Private/Admin
router.delete('/roles/:id', async (req, res) => {
  try {
    const role = await JobRole.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    
    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    console.error('Delete role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;