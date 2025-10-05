import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const initialSetup = async () => {
  try {
    console.log('🚀 Starting initial setup...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Create a test admin user
    const testUser = await User.create({
      name: 'Test Student',
      email: 'test@example.com',
      password: 'password123',
      role: 'student',
      profile: {
        skills: ['JavaScript', 'React', 'Node.js'],
        readinessScore: 75,
        level: 1,
        xp: 0
      }
    });
    
    console.log('✅ Test user created:');
    console.log('   Email: test@example.com');
    console.log('   Password: password123');
    
    await mongoose.connection.close();
    console.log('🎉 Initial setup completed!');
    console.log('💡 You can now start your frontend and login with the test user.');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
};

initialSetup();