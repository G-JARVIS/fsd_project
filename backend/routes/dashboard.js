import express from 'express';
import { protect } from '../middleware/auth.js';
import Application from '../models/Application.js';
import Event from '../models/Event.js';
import UserProgress from '../models/UserProgress.js';
import LearningCourse from '../models/LearningCourse.js';

const router = express.Router();

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get applications count by status
    const applications = await Application.find({ userId });
    const appliedCount = applications.filter(app => app.status === 'applied').length;
    const bookmarkedCount = applications.filter(app => app.status === 'bookmarked').length;
    const interviewCount = applications.filter(app => app.status === 'interview').length;

    // Get learning progress
    const userProgress = await UserProgress.find({ userId });
    const completedCourses = userProgress.filter(up => up.completed).length;
    const totalXp = userProgress.reduce((sum, up) => sum + (up.score || 0), 0);

    // Get upcoming events
    const upcomingEvents = await Event.find({
      'attendees.userId': userId,
      date: { $gte: new Date() },
      status: 'scheduled'
    }).limit(5);

    const stats = {
      applications: {
        applied: appliedCount,
        bookmarked: bookmarkedCount,
        interviews: interviewCount,
        total: applications.length
      },
      learning: {
        completedCourses,
        totalXp,
        inProgress: userProgress.filter(up => !up.completed && up.progress > 0).length
      },
      readiness: {
        score: req.user.profile.readinessScore || 78, // Default from frontend
        level: req.user.profile.level || 12
      },
      upcomingEvents: upcomingEvents.length
    };

    res.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get recent activity
// @route   GET /api/dashboard/recent-activity
// @access  Private
router.get('/recent-activity', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get recent applications
    const recentApplications = await Application.find({ userId })
      .populate('roleId', 'title company')
      .populate('driveId', 'company role')
      .sort({ appliedDate: -1 })
      .limit(5);

    // Get recent learning progress
    const recentProgress = await UserProgress.find({ userId })
      .populate('courseId', 'title')
      .populate('quizId', 'title')
      .sort({ lastAccessed: -1 })
      .limit(5);

    const activities = [
      ...recentApplications.map(app => ({
        type: 'application',
        title: `Applied for ${app.roleId?.title || app.driveId?.role}`,
        description: `at ${app.roleId?.company || app.driveId?.company}`,
        timestamp: app.appliedDate,
        status: app.status
      })),
      ...recentProgress.map(progress => ({
        type: progress.quizId ? 'quiz' : 'course',
        title: progress.quizId ? 
          `Completed ${progress.quizId.title} quiz` : 
          `Progress in ${progress.courseId?.title}`,
        description: progress.quizId ? 
          `Score: ${progress.score}%` : 
          `${progress.progress}% complete`,
        timestamp: progress.lastAccessed,
        score: progress.score
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
     .slice(0, 10);

    res.json(activities);
  } catch (error) {
    console.error('Recent activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get upcoming events
// @route   GET /api/dashboard/upcoming-events
// @access  Private
router.get('/upcoming-events', protect, async (req, res) => {
  try {
    const events = await Event.find({
      'attendees.userId': req.user._id,
      date: { $gte: new Date() },
      status: 'scheduled'
    })
    .sort({ date: 1 })
    .limit(10)
    .select('title type date time location status');

    res.json(events);
  } catch (error) {
    console.error('Upcoming events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get readiness score breakdown
// @route   GET /api/dashboard/readiness-score
// @access  Private
router.get('/readiness-score', protect, async (req, res) => {
  try {
    // This would typically involve more complex calculations
    // For now, returning mock data matching frontend structure
    const readinessData = {
      overallScore: req.user.profile.readinessScore || 78,
      factors: [
        { name: "Technical Skills", score: 85, color: "text-success" },
        { name: "Communication", score: 72, color: "text-warning" },
        { name: "Problem Solving", score: 89, color: "text-primary" },
        { name: "Industry Knowledge", score: 65, color: "text-destructive" },
      ],
      recommendation: "Complete System Design course"
    };

    res.json(readinessData);
  } catch (error) {
    console.error('Readiness score error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;