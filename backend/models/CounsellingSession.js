import mongoose from 'mongoose';

const counsellingSessionSchema = new mongoose.Schema({
  counsellorName: {
    type: String,
    required: [true, 'Please add a counsellor name'],
    trim: true
  },
  topic: {
    type: String,
    required: [true, 'Please add a session topic'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Please add a session date']
  },
  time: {
    type: String,
    required: [true, 'Please add a session time']
  },
  duration: {
    type: Number,
    default: 60 // in minutes
  },
  location: {
    type: String,
    default: 'Counselling Room'
  },
  description: String,
  maxParticipants: {
    type: Number,
    default: 1 // Individual session by default
  },
  sessionType: {
    type: String,
    enum: ['individual', 'group'],
    default: 'individual'
  },
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled'
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

export default mongoose.model('CounsellingSession', counsellingSessionSchema);