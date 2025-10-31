import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CounsellingSession from '../models/CounsellingSession.js';
import connectDB from '../config/db.js';

// Load env vars
dotenv.config();

const sampleSessions = [
  {
    counsellorName: 'Dr. Rajesh Kumar',
    topic: 'Career Planning & Goal Setting',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    time: '10:00 AM',
    duration: 60,
    location: 'Counselling Room A',
    description: 'Comprehensive career planning session to help you identify your career goals and create a roadmap to achieve them.',
    maxParticipants: 1,
    sessionType: 'individual'
  },
  {
    counsellorName: 'Dr. Priya Sharma',
    topic: 'Resume Review & Interview Preparation',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    time: '2:00 PM',
    duration: 45,
    location: 'Counselling Room B',
    description: 'Get expert feedback on your resume and practice interview skills with mock interviews.',
    maxParticipants: 1,
    sessionType: 'individual'
  },
  {
    counsellorName: 'Prof. Amit Patel',
    topic: 'Technical Skills Development',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    time: '11:00 AM',
    duration: 90,
    location: 'Computer Lab',
    description: 'Guidance on developing technical skills relevant to your career path and industry requirements.',
    maxParticipants: 1,
    sessionType: 'individual'
  },
  {
    counsellorName: 'Dr. Sunita Verma',
    topic: 'Stress Management & Work-Life Balance',
    date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    time: '3:30 PM',
    duration: 60,
    location: 'Wellness Center',
    description: 'Learn effective stress management techniques and strategies for maintaining work-life balance.',
    maxParticipants: 5,
    sessionType: 'group'
  },
  {
    counsellorName: 'Mr. Vikash Singh',
    topic: 'Industry Insights & Networking',
    date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
    time: '4:00 PM',
    duration: 75,
    location: 'Conference Room',
    description: 'Gain insights into various industries and learn effective networking strategies for career growth.',
    maxParticipants: 3,
    sessionType: 'group'
  },
  {
    counsellorName: 'Dr. Meera Joshi',
    topic: 'Personal Branding & LinkedIn Optimization',
    date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
    time: '1:00 PM',
    duration: 60,
    location: 'Digital Lab',
    description: 'Build your personal brand and optimize your LinkedIn profile to attract recruiters and opportunities.',
    maxParticipants: 1,
    sessionType: 'individual'
  }
];

const seedCounsellingSessions = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing sessions
    await CounsellingSession.deleteMany({});
    console.log('Cleared existing counselling sessions');

    // Insert sample sessions
    const createdSessions = await CounsellingSession.insertMany(sampleSessions);
    console.log(`Created ${createdSessions.length} sample counselling sessions:`);
    
    createdSessions.forEach(session => {
      console.log(`- ${session.topic} by ${session.counsellorName} on ${session.date.toDateString()} at ${session.time}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding counselling sessions:', error);
    process.exit(1);
  }
};

seedCounsellingSessions();