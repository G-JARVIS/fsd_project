import express from 'express';
import { protect } from '../middleware/auth.js';
import LearningCourse from '../models/LearningCourse.js';
import UserProgress from '../models/UserProgress.js';

const router = express.Router();

// @desc    Get all courses
// @route   GET /api/learning/courses
// @access  Public
router.get('/courses', async (req, res) => {
  try {
    const { search, category, level, page = 1, limit = 12 } = req.query;
    
    let query = { isActive: true };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { instructor: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (level) {
      query.level = level;
    }

    const courses = await LearningCourse.find(query)
      .sort({ rating: -1, students: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await LearningCourse.countDocuments(query);

    res.json({
      courses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get single course
// @route   GET /api/learning/courses/:id
// @access  Public
router.get('/courses/:id', async (req, res) => {
  try {
    const course = await LearningCourse.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get user progress for courses
// @route   GET /api/learning/progress
// @access  Private
router.get('/progress', protect, async (req, res) => {
  try {
    const progress = await UserProgress.find({ 
      userId: req.user._id,
      courseId: { $exists: true }
    }).populate('courseId', 'title instructor thumbnail duration');

    res.json(progress);
  } catch (error) {
    console.error('Get learning progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update course progress
// @route   PUT /api/learning/progress/:courseId
// @access  Private
router.put('/progress/:courseId', protect, async (req, res) => {
  try {
    const { progress, completed } = req.body;
    
    let userProgress = await UserProgress.findOne({
      userId: req.user._id,
      courseId: req.params.courseId
    });

    if (userProgress) {
      userProgress.progress = progress;
      userProgress.completed = completed;
      userProgress.lastAccessed = new Date();
      
      if (completed) {
        userProgress.completedAt = new Date();
      }
    } else {
      userProgress = new UserProgress({
        userId: req.user._id,
        courseId: req.params.courseId,
        progress,
        completed,
        lastAccessed: new Date()
      });
    }

    await userProgress.save();
    res.json(userProgress);
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;