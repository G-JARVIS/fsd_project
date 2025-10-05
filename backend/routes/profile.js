import express from 'express';
import User from '../models/User.js';
import UserCourse from '../models/UserCourse.js';
import Application from '../models/Application.js';
import { protect } from '../middleware/auth.js';
import upload, { deleteOldResume } from '../utils/fileUpload.js';
import path from 'path';

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    // Get user's courses
    const userCourses = await UserCourse.find({ user: req.user._id })
      .populate('course', 'title category difficulty duration')
      .sort({ enrolledAt: -1 });

    // Get user's drive applications
    const driveApplications = await Application.find({ 
      userId: req.user._id,
      driveId: { $exists: true }
    })
      .populate('driveId', 'company role location package deadline')
      .sort({ appliedDate: -1 });

    res.json({
      user,
      courses: userCourses,
      applications: driveApplications,
      stats: {
        totalCourses: userCourses.length,
        completedCourses: userCourses.filter(c => c.status === 'completed').length,
        totalApplications: driveApplications.length,
        selectedApplications: driveApplications.filter(a => a.status === 'selected').length
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
router.put('/', protect, async (req, res) => {
  try {
    const {
      name,
      profile: {
        phone,
        college,
        branch,
        graduationYear,
        yearOfStudy,
        bio,
        location,
        linkedin,
        github,
        portfolio,
        cgpa,
        skills,
        achievements,
        certifications,
        projects,
        experience
      }
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update basic info
    if (name) user.name = name;

    // Update profile fields
    if (phone !== undefined) user.profile.phone = phone;
    if (college !== undefined) user.profile.college = college;
    if (branch !== undefined) user.profile.branch = branch;
    if (graduationYear !== undefined) user.profile.graduationYear = graduationYear;
    if (yearOfStudy !== undefined) user.profile.yearOfStudy = yearOfStudy;
    if (bio !== undefined) user.profile.bio = bio;
    if (location !== undefined) user.profile.location = location;
    if (linkedin !== undefined) user.profile.linkedin = linkedin;
    if (github !== undefined) user.profile.github = github;
    if (portfolio !== undefined) user.profile.portfolio = portfolio;
    if (cgpa !== undefined) user.profile.cgpa = cgpa;
    if (skills !== undefined) user.profile.skills = skills;
    if (achievements !== undefined) user.profile.achievements = achievements;
    if (certifications !== undefined) user.profile.certifications = certifications;
    if (projects !== undefined) user.profile.projects = projects;
    if (experience !== undefined) user.profile.experience = experience;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: await User.findById(req.user._id).select('-password')
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Upload profile picture
// @route   POST /api/profile/avatar
// @access  Private
router.post('/avatar', protect, async (req, res) => {
  try {
    const { avatar } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.profile.avatar = avatar;
    await user.save();

    res.json({
      message: 'Profile picture updated successfully',
      avatar: user.profile.avatar
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Upload resume
// @route   POST /api/profile/resume
// @access  Private
router.post('/resume', protect, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete old resume if exists
    if (user.profile.resumePath) {
      deleteOldResume(user.profile.resumePath);
    }

    // Update user with new resume path
    user.profile.resumePath = req.file.path;
    user.profile.resume = req.file.filename;
    await user.save();

    res.json({
      message: 'Resume uploaded successfully',
      resumePath: user.profile.resumePath,
      resumeFilename: user.profile.resume
    });
  } catch (error) {
    console.error('Upload resume error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Download resume
// @route   GET /api/profile/resume/:userId
// @access  Private
router.get('/resume/:userId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user || !user.profile.resumePath) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const resumePath = path.resolve(user.profile.resumePath);
    
    // Check if file exists
    if (!require('fs').existsSync(resumePath)) {
      return res.status(404).json({ message: 'Resume file not found' });
    }

    res.download(resumePath, user.profile.resume || 'resume.pdf');
  } catch (error) {
    console.error('Download resume error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete resume
// @route   DELETE /api/profile/resume
// @access  Private
router.delete('/resume', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete resume file if exists
    if (user.profile.resumePath) {
      deleteOldResume(user.profile.resumePath);
    }

    // Clear resume fields
    user.profile.resumePath = undefined;
    user.profile.resume = undefined;
    await user.save();

    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;