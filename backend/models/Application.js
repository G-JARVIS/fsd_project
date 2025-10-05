import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobRole'
  },
  driveId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CompanyDrive'
  },
  status: {
    type: String,
    enum: ['applied', 'bookmarked', 'eligible', 'rejected', 'shortlisted', 'interview', 'selected'],
    default: 'applied'
  },
  appliedDate: {
    type: Date,
    default: Date.now
  },
  currentStage: String,
  processStageIndex: {
    type: Number,
    default: 0
  },
  nextStep: String,
  notes: String,
  resume: String,
  coverLetter: String,
  updates: [{
    stage: String,
    status: String,
    date: Date,
    notes: String
  }]
});

// Compound index to prevent duplicate applications
// Create partial indexes that only apply when the field exists and is an ObjectId
applicationSchema.index(
  { userId: 1, roleId: 1 }, 
  { 
    unique: true, 
    partialFilterExpression: { roleId: { $exists: true, $type: "objectId" } }
  }
);
applicationSchema.index(
  { userId: 1, driveId: 1 }, 
  { 
    unique: true, 
    partialFilterExpression: { driveId: { $exists: true, $type: "objectId" } }
  }
);

export default mongoose.model('Application', applicationSchema);