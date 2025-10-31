import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add an event title'],
    trim: true
  },
  type: {
    type: String,
    enum: ['Placement Drive', 'Workshop', 'Interview', 'Counseling', 'Webinar'],
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Please add an event date']
  },
  time: String,
  location: String,
  description: String,
  organizer: String,
  maxAttendees: Number,
  attendees: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['registered', 'attended', 'cancelled'],
      default: 'registered'
    }
  }],
  status: {
    type: String,
    enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  googleEventId: {
    type: String,
  },
  metadata: {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application'
    },
    driveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CompanyDrive'
    },
    stageIndex: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Event', eventSchema);