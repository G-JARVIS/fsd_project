import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a quiz title'],
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  questions: [{
    text: {
      type: String,
      required: true
    },
    options: [{
      type: String,
      required: true
    }],
    correctIndex: {
      type: Number,
      required: true,
      min: 0,
      max: 3
    },
    explanation: String
  }],
  timeLimit: {
    type: Number, // in minutes
    default: 10
  },
  passingScore: {
    type: Number,
    default: 70
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Quiz', quizSchema);