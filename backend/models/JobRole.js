import mongoose from 'mongoose';

const jobRoleSchema = new mongoose.Schema({
  roleName: {
    type: String,
    required: [true, 'Please add a role name'],
    trim: true,
    unique: true
  },
  techStack: {
    type: [String],
    required: [true, 'Please add basic tech stack'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'Tech stack must have at least one technology'
    }
  },
  averagePackage: {
    type: String,
    required: [true, 'Please add average package information']
  },
  description: {
    type: String,
    required: [true, 'Please add a role description']
  },
  majorCompanies: {
    type: [String],
    required: [true, 'Please add major companies that hire for this role'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'Must have at least one major company'
    }
  },
  skillsRequired: [String],
  careerPath: String,
  workEnvironment: String,
  jobResponsibilities: [String],
  educationRequirements: [String],
  experienceLevel: {
    type: String,
    enum: ['Entry Level', 'Mid Level', 'Senior Level', 'All Levels'],
    default: 'All Levels'
  },
  industryDemand: {
    type: String,
    enum: ['Very High', 'High', 'Medium', 'Low'],
    default: 'Medium'
  },
  remoteWorkOptions: {
    type: String,
    enum: ['Fully Remote', 'Hybrid', 'On-site', 'Varies'],
    default: 'Varies'
  },
  featured: {
    type: Boolean,
    default: false
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

export default mongoose.model('JobRole', jobRoleSchema);