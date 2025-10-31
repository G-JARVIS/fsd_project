import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Application from '../models/Application.js';
import CompanyDrive from '../models/CompanyDrive.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const updateApplicationStages = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all applications with drive IDs
    const applications = await Application.find({ driveId: { $exists: true } }).populate('driveId');
    console.log(`Found ${applications.length} drive applications to update`);

    let updated = 0;

    for (const application of applications) {
      if (application.driveId && application.driveId.process) {
        const drive = application.driveId;
        
        // Determine current stage index based on current stage
        let processStageIndex = 0;
        const currentStage = application.currentStage || 'Applied';
        
        // Find the index of current stage in the process array
        const stageIndex = drive.process.findIndex(stage => stage === currentStage);
        if (stageIndex !== -1) {
          processStageIndex = stageIndex;
        }

        // Calculate next step
        const nextStepIndex = processStageIndex + 1;
        const nextStep = nextStepIndex < drive.process.length ? drive.process[nextStepIndex] : 'Process Complete';

        // Update the application
        await Application.findByIdAndUpdate(application._id, {
          processStageIndex: processStageIndex,
          nextStep: nextStep,
          currentStage: drive.process[processStageIndex] || 'Applied'
        });

        console.log(`Updated application ${application._id}: Stage ${processStageIndex} (${drive.process[processStageIndex]}) -> Next: ${nextStep}`);
        updated++;
      }
    }

    console.log(`\n✅ Updated ${updated} applications with process stage tracking`);
    process.exit(0);
  } catch (error) {
    console.error('Error updating application stages:', error);
    process.exit(1);
  }
};

updateApplicationStages();