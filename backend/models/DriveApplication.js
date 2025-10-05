import mongoose from 'mongoose';

const driveApplicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  drive: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Drive',
    required: true
  },
  status: {
    type: String,
    enum: ['applied', 'shortlisted', 'interview-scheduled', 'selected', 'rejected', 'withdrawn'],
    default: 'applied'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  resume: String, // URL to uploaded resume
  coverLetter: String,
  notes: String, // Internal notes
  interviewDate: Date,
  feedback: String,
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to prevent duplicate applications
driveApplicationSchema.index({ user: 1, drive: 1 }, { unique: true });

// Update the updatedAt field before saving
driveApplicationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('DriveApplication', driveApplicationSchema);