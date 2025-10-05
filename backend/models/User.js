import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'admin', 'counselor'],
    default: 'student'
  },
  profile: {
    avatar: String,
    skills: [String],
    resume: String,
    resumePath: String,
    readinessScore: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    phone: String,
    college: String,
    branch: {
      type: String,
      enum: ['CS', 'IT', 'EXTC', 'Mech', 'Civil', 'Chemical', 'Electrical', 'Electronics', 'Biomedical', 'Other']
    },
    graduationYear: Number,
    yearOfStudy: {
      type: String,
      enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate']
    },
    bio: String,
    location: String,
    linkedin: String,
    github: String,
    portfolio: String,
    cgpa: Number,
    achievements: [String],
    certifications: [String],
    projects: [{
      title: String,
      description: String,
      technologies: [String],
      link: String,
      startDate: Date,
      endDate: Date
    }],
    experience: [{
      company: String,
      position: String,
      description: String,
      startDate: Date,
      endDate: Date,
      current: { type: Boolean, default: false }
    }]
  },
  google: {
    // store minimal Google OAuth tokens per user for server-side calendar sync
    refreshToken: { type: String },
    accessToken: { type: String },
    tokenExpiry: { type: Date },
    calendarConnected: { type: Boolean, default: false }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);