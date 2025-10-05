import mongoose from 'mongoose';

const counsellingApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CounsellingSession',
    required: true
  },
  status: {
    type: String,
    enum: ['applied', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: 'applied'
  },
  appliedDate: {
    type: Date,
    default: Date.now
  },
  reason: {
    type: String,
    required: [true, 'Please provide a reason for counselling']
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  previousCounselling: {
    type: Boolean,
    default: false
  },
  notes: String,
  counsellorNotes: String,
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comments: String,
    submittedAt: Date
  },
  updates: [{
    status: String,
    date: Date,
    notes: String,
    updatedBy: String
  }]
});

// Compound index to prevent duplicate applications for the same session
counsellingApplicationSchema.index({ userId: 1, sessionId: 1 }, { unique: true });

export default mongoose.model('CounsellingApplication', counsellingApplicationSchema);