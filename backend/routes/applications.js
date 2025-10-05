import express from 'express';
import { protect } from '../middleware/auth.js';
import Application from '../models/Application.js';
import JobRole from '../models/JobRole.js';
import CompanyDrive from '../models/CompanyDrive.js';

const router = express.Router();

// @desc    Get all applications for the logged-in user
// @route   GET /api/applications
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, type, page = 1, limit = 10 } = req.query;
    
    let query = { userId: req.user._id };
    
    // Filter by status if provided
    if (status && status !== 'all') {
      query.status = status;
    }

    // Filter by type (role or drive) if provided
    if (type === 'role') {
      query.roleId = { $exists: true };
      query.driveId = { $exists: false };
    } else if (type === 'drive') {
      query.driveId = { $exists: true };
      query.roleId = { $exists: false };
    }

    const applications = await Application.find(query)
      .populate('roleId', 'title company location salary experience skills featured matchScore companyLogo')
      .populate('driveId', 'company role location package deadline logo featured requirements')
      .sort({ appliedDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Application.countDocuments(query);

    // Transform the data to match frontend structure
    const transformedApplications = applications.map(app => {
      if (app.roleId) {
        // Job role application
        return {
          id: app._id,
          type: 'role',
          title: app.roleId.title,
          company: app.roleId.company,
          location: app.roleId.location,
          salary: app.roleId.salary,
          experience: app.roleId.experience,
          status: app.status,
          appliedDate: app.appliedDate,
          currentStage: app.currentStage,
          nextStep: app.nextStep,
          logo: app.roleId.companyLogo,
          featured: app.roleId.featured,
          matchScore: app.roleId.matchScore,
          skills: app.roleId.skills
        };
      } else if (app.driveId) {
        // Company drive application
        return {
          id: app._id,
          type: 'drive',
          title: app.driveId.role,
          company: app.driveId.company,
          location: app.driveId.location,
          salary: app.driveId.package,
          status: app.status,
          appliedDate: app.appliedDate,
          currentStage: app.currentStage,
          nextStep: app.nextStep,
          deadline: app.driveId.deadline,
          logo: app.driveId.logo,
          featured: app.driveId.featured,
          requirements: app.driveId.requirements
        };
      }
    }).filter(Boolean); // Remove any null entries

    res.json({
      applications: transformedApplications,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get application statistics for dashboard
// @route   GET /api/applications/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user._id });
    
    const stats = {
      total: applications.length,
      applied: applications.filter(app => app.status === 'applied').length,
      bookmarked: applications.filter(app => app.status === 'bookmarked').length,
      interview: applications.filter(app => app.status === 'interview').length,
      shortlisted: applications.filter(app => app.status === 'shortlisted').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
      selected: applications.filter(app => app.status === 'selected').length
    };

    res.json(stats);
  } catch (error) {
    console.error('Get application stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get drive applications for MyDrives page
// @route   GET /api/applications/drives
// @access  Private
router.get('/drives', protect, async (req, res) => {
  try {
    const applications = await Application.find({
      userId: req.user._id,
      driveId: { $exists: true }
    }).populate('driveId');

    // Transform to match MyDrives expected format
    const transformedApplications = applications.map(app => ({
      id: app._id,
      driveId: app.driveId._id,
      status: app.status,
      appliedDate: app.appliedDate,
      currentStage: app.currentStage,
      processStageIndex: app.processStageIndex || 0,
      nextStep: app.nextStep
    }));

    res.json({
      applications: transformedApplications
    });
  } catch (error) {
    console.error('Get drive applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get application status with full drive details
// @route   GET /api/applications/status/:applicationId
// @access  Private
router.get('/status/:applicationId', protect, async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.applicationId,
      userId: req.user._id
    }).populate('driveId');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Calculate progress and next steps
    const drive = application.driveId;
    const processStageIndex = application.processStageIndex || 0;
    const totalStages = drive.process ? drive.process.length : 1;
    
    let progress = 0;
    let nextStep = application.nextStep || 'Waiting for update';
    
    // Only calculate progress for non-rejected applications
    if (application.status !== 'rejected') {
      progress = Math.round((processStageIndex / totalStages) * 100);
      
      // Get next step based on current stage index
      const nextStepIndex = processStageIndex + 1;
      if (drive.process && nextStepIndex < totalStages) {
        nextStep = `Prepare for ${drive.process[nextStepIndex]}`;
      } else if (nextStepIndex >= totalStages) {
        nextStep = 'Process Complete';
      }
    } else {
      // For rejected applications, use the stored nextStep or default message
      nextStep = application.nextStep || 'Application was not selected';
      progress = 0;
    }

    res.json({
      application: {
        id: application._id,
        status: application.status,
        appliedDate: application.appliedDate,
        currentStage: application.currentStage,
        processStageIndex: processStageIndex,
        nextStep: nextStep,
        progress: progress,
        updates: application.updates || []
      },
      drive: {
        id: drive._id,
        company: drive.company,
        role: drive.role,
        location: drive.location,
        package: drive.package,
        logo: drive.logo,
        process: drive.process,
        processSchedule: drive.processSchedule,
        deadline: drive.deadline
      }
    });
  } catch (error) {
    console.error('Get application status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Bookmark a job role or drive
// @route   POST /api/applications/bookmark
// @access  Private
router.post('/bookmark', protect, async (req, res) => {
  try {
    const { roleId, driveId } = req.body;

    if (!roleId && !driveId) {
      return res.status(400).json({ message: 'Either roleId or driveId is required' });
    }

    // Check if already bookmarked
    const query = { 
      userId: req.user._id,
      status: 'bookmarked'
    };

    if (roleId) {
      query.roleId = roleId;
      // Verify role exists
      const role = await JobRole.findById(roleId);
      if (!role) {
        return res.status(404).json({ message: 'Job role not found' });
      }
    } else if (driveId) {
      query.driveId = driveId;
      // Verify drive exists
      const drive = await CompanyDrive.findById(driveId);
      if (!drive) {
        return res.status(404).json({ message: 'Company drive not found' });
      }
    }

    const existingBookmark = await Application.findOne(query);

    if (existingBookmark) {
      return res.status(400).json({ message: 'Already bookmarked' });
    }

    // Check if already applied (then update status to bookmarked)
    const existingApplication = await Application.findOne({
      userId: req.user._id,
      $or: [
        { roleId: roleId || null },
        { driveId: driveId || null }
      ]
    });

    if (existingApplication) {
      existingApplication.status = 'bookmarked';
      await existingApplication.save();
      return res.json(existingApplication);
    }

    // Create new bookmark
    const bookmark = new Application({
      userId: req.user._id,
      roleId: roleId || null,
      driveId: driveId || null,
      status: 'bookmarked',
      currentStage: 'Bookmarked',
      nextStep: 'Apply when ready'
    });

    await bookmark.save();

    // Populate the response
    if (roleId) {
      await bookmark.populate('roleId', 'title company location salary');
    } else if (driveId) {
      await bookmark.populate('driveId', 'company role location package');
    }

    res.status(201).json(bookmark);
  } catch (error) {
    console.error('Bookmark error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get applications by status for MyDrives page
// @route   GET /api/applications/status/:status
// @access  Private
router.get('/status/:status', protect, async (req, res) => {
  try {
    const { status } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const validStatuses = ['applied', 'bookmarked', 'eligible', 'rejected', 'shortlisted', 'interview', 'selected'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const applications = await Application.find({
      userId: req.user._id,
      status: status
    })
    .populate('roleId', 'title company location salary experience skills')
    .populate('driveId', 'company role location package deadline logo requirements applicants')
    .sort({ appliedDate: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await Application.countDocuments({
      userId: req.user._id,
      status: status
    });

    // Transform for frontend MyDrives component
    const transformedApplications = applications.map(app => {
      const baseData = {
        id: app._id,
        status: app.status,
        appliedDate: app.appliedDate,
        currentStage: app.currentStage,
        nextStep: app.nextStep
      };

      if (app.driveId) {
        return {
          ...baseData,
          company: app.driveId.company,
          role: app.driveId.role,
          location: app.driveId.location,
          package: app.driveId.package,
          deadline: app.driveId.deadline,
          logo: app.driveId.logo,
          featured: app.driveId.featured,
          requirements: app.driveId.requirements,
          applicants: app.driveId.applicants,
          type: 'drive'
        };
      } else if (app.roleId) {
        return {
          ...baseData,
          company: app.roleId.company,
          role: app.roleId.title,
          location: app.roleId.location,
          package: app.roleId.salary,
          logo: app.roleId.companyLogo,
          featured: app.roleId.featured,
          requirements: app.roleId.skills,
          type: 'role'
        };
      }
    }).filter(Boolean);

    res.json({
      applications: transformedApplications,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get applications by status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Check if user has applied to a role or drive
// @route   GET /api/applications/check/:type/:id
// @access  Private
router.get('/check/:type/:id', protect, async (req, res) => {
  try {
    const { type, id } = req.params;

    let query = { userId: req.user._id };

    if (type === 'role') {
      query.roleId = id;
    } else if (type === 'drive') {
      query.driveId = id;
    } else {
      return res.status(400).json({ message: 'Invalid type. Use "role" or "drive"' });
    }

    const application = await Application.findOne(query);

    if (application) {
      res.json({
        hasApplied: true,
        status: application.status,
        applicationId: application._id,
        appliedDate: application.appliedDate
      });
    } else {
      res.json({
        hasApplied: false
      });
    }
  } catch (error) {
    console.error('Check application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get single application details
// @route   GET /api/applications/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user._id
    })
    .populate('roleId')
    .populate('driveId');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status, processStageIndex, notes } = req.body;

    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('driveId');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const drive = application.driveId;
    
    // Calculate stage information based on processStageIndex
    let currentStage = application.currentStage;
    let nextStep = application.nextStep;
    
    if (processStageIndex !== undefined && drive && drive.process) {
      currentStage = drive.process[processStageIndex] || 'Applied';
      const nextStepIndex = processStageIndex + 1;
      nextStep = nextStepIndex < drive.process.length ? drive.process[nextStepIndex] : 'Process Complete';
    }

    // Add update to history
    if (!application.updates) {
      application.updates = [];
    }
    
    application.updates.push({
      stage: currentStage,
      status: status || application.status,
      date: new Date(),
      notes: notes || `Stage updated to ${currentStage}`
    });

    // Update application fields
    if (status) application.status = status;
    if (processStageIndex !== undefined) application.processStageIndex = processStageIndex;
    application.currentStage = currentStage;
    application.nextStep = nextStep;
    if (notes) application.notes = notes;

    await application.save();

    res.json(application);
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get application timeline/updates
// @route   GET /api/applications/:id/timeline
// @access  Private
router.get('/:id/timeline', protect, async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).select('updates appliedDate status currentStage');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Create timeline from updates and current status
    const timeline = [
      {
        stage: 'Applied',
        status: 'applied',
        date: application.appliedDate,
        notes: 'Application submitted'
      },
      ...(application.updates || [])
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(timeline);
  } catch (error) {
    console.error('Get application timeline error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Withdraw application
// @route   POST /api/applications/:id/withdraw
// @access  Private
router.post('/:id/withdraw', protect, async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.status === 'withdrawn') {
      return res.status(400).json({ message: 'Application already withdrawn' });
    }

    // Update status to withdrawn
    application.status = 'withdrawn';
    application.currentStage = 'Withdrawn';
    application.nextStep = 'Application withdrawn by user';

    // Add to updates history
    if (application.updates) {
      application.updates.push({
        stage: application.currentStage,
        status: application.status,
        date: new Date(),
        notes: 'Application withdrawn by user'
      });
    }

    await application.save();

    res.json({ 
      message: 'Application withdrawn successfully',
      application 
    });
  } catch (error) {
    console.error('Withdraw application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Remove bookmark or application
// @route   DELETE /api/applications/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    await Application.deleteOne({ _id: req.params.id });

    res.json({ message: 'Application removed successfully' });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;