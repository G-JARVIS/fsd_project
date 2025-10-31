import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import JobRole from '../models/JobRole.js';

const router = express.Router();

// @desc    Get all job roles (informational only)
// @route   GET /api/roles
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, experienceLevel, industryDemand, page = 1, limit = 12 } = req.query;
    
    let query = { isActive: true };
    
    if (search) {
      query.$or = [
        { roleName: { $regex: search, $options: 'i' } },
        { techStack: { $in: [new RegExp(search, 'i')] } },
        { majorCompanies: { $in: [new RegExp(search, 'i')] } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    if (industryDemand) {
      query.industryDemand = industryDemand;
    }

    const roles = await JobRole.find(query)
      .sort({ featured: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await JobRole.countDocuments(query);

    res.json({
      roles,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get roles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get role statistics
// @route   GET /api/roles/stats/overview
// @access  Public
router.get('/stats/overview', async (req, res) => {
  try {
    const totalRoles = await JobRole.countDocuments({ isActive: true });
    
    const experienceLevelStats = await JobRole.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$experienceLevel', count: { $sum: 1 } } }
    ]);

    const industryDemandStats = await JobRole.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$industryDemand', count: { $sum: 1 } } }
    ]);

    const topTechnologies = await JobRole.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$techStack' },
      { $group: { _id: '$techStack', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      totalRoles,
      experienceLevelStats,
      industryDemandStats,
      topTechnologies
    });
  } catch (error) {
    console.error('Get role stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get single job role details
// @route   GET /api/roles/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const role = await JobRole.findById(req.params.id);
    
    if (!role) {
      return res.status(404).json({ message: 'Job role not found' });
    }

    res.json(role);
  } catch (error) {
    console.error('Get role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN ROUTES

// @desc    Create new job role (Admin only)
// @route   POST /api/roles/admin
// @access  Private/Admin
router.post('/admin', protect, adminOnly, async (req, res) => {
  try {
    const role = await JobRole.create(req.body);
    res.status(201).json(role);
  } catch (error) {
    console.error('Create role error:', error);
    res.status(400).json({ message: 'Invalid role data' });
  }
});

// @desc    Update job role (Admin only)
// @route   PUT /api/roles/admin/:id
// @access  Private/Admin
router.put('/admin/:id', protect, adminOnly, async (req, res) => {
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

// @desc    Delete job role (Admin only)
// @route   DELETE /api/roles/admin/:id
// @access  Private/Admin
router.delete('/admin/:id', protect, adminOnly, async (req, res) => {
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

// @desc    Get all roles for admin management
// @route   GET /api/roles/admin/all
// @access  Private/Admin
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const roles = await JobRole.find().sort({ createdAt: -1 });
    res.json(roles);
  } catch (error) {
    console.error('Get all roles error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;