import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Application from '../models/Application.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const checkApplications = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check all applications
    const applications = await Application.find({});
    console.log(`\nTotal applications: ${applications.length}`);

    // Check for problematic records
    const roleApplications = applications.filter(app => app.roleId && !app.driveId);
    const driveApplications = applications.filter(app => app.driveId && !app.roleId);
    const invalidApplications = applications.filter(app => (!app.roleId && !app.driveId) || (app.roleId && app.driveId));

    console.log(`Role applications: ${roleApplications.length}`);
    console.log(`Drive applications: ${driveApplications.length}`);
    console.log(`Invalid applications (neither or both): ${invalidApplications.length}`);

    if (invalidApplications.length > 0) {
      console.log('\nInvalid applications:');
      invalidApplications.forEach(app => {
        console.log(`- ID: ${app._id}, roleId: ${app.roleId}, driveId: ${app.driveId}, status: ${app.status}`);
      });
    }

    // Check for potential duplicates
    const userDriveMap = new Map();
    const userRoleMap = new Map();
    let duplicates = 0;

    applications.forEach(app => {
      if (app.driveId) {
        const key = `${app.userId}_${app.driveId}`;
        if (userDriveMap.has(key)) {
          console.log(`Duplicate drive application: User ${app.userId} -> Drive ${app.driveId}`);
          duplicates++;
        } else {
          userDriveMap.set(key, app._id);
        }
      }
      
      if (app.roleId) {
        const key = `${app.userId}_${app.roleId}`;
        if (userRoleMap.has(key)) {
          console.log(`Duplicate role application: User ${app.userId} -> Role ${app.roleId}`);
          duplicates++;
        } else {
          userRoleMap.set(key, app._id);
        }
      }
    });

    console.log(`\nDuplicate applications found: ${duplicates}`);

    if (duplicates === 0 && invalidApplications.length === 0) {
      console.log('\n✅ All applications look good!');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error checking applications:', error);
    process.exit(1);
  }
};

checkApplications();