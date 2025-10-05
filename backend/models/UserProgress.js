import mongoose from 'mongoose';

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LearningCourse'
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  score: Number,
  timeSpent: Number, // in minutes
  lastAccessed: Date,
  answers: [{
    questionIndex: Number,
    selectedOption: Number,
    isCorrect: Boolean
  }],
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date
});

// Compound index for efficient queries
userProgressSchema.index({ userId: 1, courseId: 1 });
userProgressSchema.index({ userId: 1, quizId: 1 });

export default mongoose.model('UserProgress', userProgressSchema);