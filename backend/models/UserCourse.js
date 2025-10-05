import mongoose from 'mongoose';

const userCourseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  status: {
    type: String,
    enum: ['enrolled', 'in-progress', 'completed', 'dropped'],
    default: 'enrolled'
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  enrolledAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: String
});

// Compound index to prevent duplicate enrollments
userCourseSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.model('UserCourse', userCourseSchema);