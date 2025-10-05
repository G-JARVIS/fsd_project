import mongoose from 'mongoose';

const companyDriveSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, 'Please add a company name'],
    trim: true
  },
  role: {
    type: String,
    required: [true, 'Please add a role'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  package: {
    type: String,
    required: [true, 'Please add package information']
  },
  deadline: {
    type: Date,
    required: [true, 'Please add a deadline']
  },
  logo: String,
  featured: {
    type: Boolean,
    default: false
  },
  requirements: [String],
  applicants: {
    type: Number,
    default: 0
  },
  description: String,
  eligibility: [String],
  process: [String],
  processSchedule: [{
    stage: String,
    date: Date,
    time: String,
    venue: String,
    description: String
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

export default mongoose.model('CompanyDrive', companyDriveSchema);