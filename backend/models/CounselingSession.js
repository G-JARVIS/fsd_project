import mongoose from 'mongoose';

const counselingSessionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  counselorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['Career Planning', 'Resume Review', 'Mock Interview', 'Skill Assessment', 'General'],
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in minutes
    default: 60
  },
  mode: {
    type: String,
    enum: ['Video Call', 'Phone', 'In-Person'],
    default: 'Video Call'
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled'
  },
  notes: String,
  feedback: {
    rating: Number,
    comment: String,
    submittedAt: Date
  },
  meetingLink: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('CounselingSession', counselingSessionSchema);