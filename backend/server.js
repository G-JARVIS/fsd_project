import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import dashboardRoutes from './routes/dashboard.js';
import rolesRoutes from './routes/roles.js';
import drivesRoutes from './routes/drives.js';
import learningRoutes from './routes/learning.js';
import quizzesRoutes from './routes/quizzes.js';
import eventsRoutes from './routes/events.js';
import googleAuthRoutes from './routes/googleAuth.js';
import counselingRoutes from './routes/counseling.js';
import applicationsRoutes from './routes/applications.js';
import adminRoutes from './routes/admin.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting - more generous for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // increased limit
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// CORS
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5173'],
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/drives', drivesRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/quizzes', quizzesRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/google', googleAuthRoutes);
app.use('/api/counseling', counselingRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/admin', adminRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'RecruitXchange API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ 
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong!' 
      : error.message 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});