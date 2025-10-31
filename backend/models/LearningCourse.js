import mongoose from 'mongoose';

const learningCourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a course title'],
    trim: true
  },
  instructor: {
    type: String,
    required: [true, 'Please add an instructor name']
  },
  duration: {
    type: String,
    required: [true, 'Please add course duration']
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  students: {
    type: Number,
    default: 0
  },
  thumbnail: String,
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  price: {
    type: String,
    enum: ['Free', 'Premium'],
    default: 'Free'
  },
  tags: [String],
  modules: {
    type: Number,
    default: 0
  },
  content: [{
    moduleTitle: String,
    videos: [{
      title: String,
      duration: String,
      url: String
    }],
    quizzes: [{
      title: String,
      questions: Number
    }]
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('LearningCourse', learningCourseSchema);