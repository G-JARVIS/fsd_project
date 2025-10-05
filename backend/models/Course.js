import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a course title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a course description']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Technical', 'Soft Skills', 'Interview Prep', 'Aptitude', 'Domain Specific']
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  duration: {
    type: Number, // in hours
    required: [true, 'Please add course duration']
  },
  instructor: {
    type: String,
    required: [true, 'Please add instructor name']
  },
  tags: [String],
  thumbnail: String,
  videoUrl: String,
  materials: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Course', courseSchema);