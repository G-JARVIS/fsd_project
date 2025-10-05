// backend/checkData.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CompanyDrive from './models/CompanyDrive.js';
import CounselingSession from './models/CounselingSession.js';
import User from './models/User.js';

dotenv.config();

const checkData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check company drives
    const drives = await CompanyDrive.find();
    console.log('🏢 Company Drives:', drives.length);
    drives.forEach(drive => {
      console.log(`   - ${drive.company}: ${drive.role} (${drive.applicants} applicants)`);
    });

    // Check counseling sessions
    const sessions = await CounselingSession.find().populate('counselorId studentId');
    console.log('\n🎯 Counseling Sessions:', sessions.length);
    sessions.forEach(session => {
      console.log(`   - ${session.type} with ${session.counselorId?.name || 'N/A'}`);
    });

    // Check counselors
    const counselors = await User.find({ role: 'counselor' });
    console.log('\n👨‍💼 Counselors:', counselors.length);
    counselors.forEach(counselor => {
      console.log(`   - ${counselor.name} (${counselor.email})`);
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

checkData();