import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const fixIndexes = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('applications');

    // Drop existing problematic indexes
    try {
      await collection.dropIndex('userId_1_roleId_1');
      console.log('Dropped userId_1_roleId_1 index');
    } catch (error) {
      console.log('Index userId_1_roleId_1 does not exist or already dropped');
    }

    try {
      await collection.dropIndex('userId_1_driveId_1');
      console.log('Dropped userId_1_driveId_1 index');
    } catch (error) {
      console.log('Index userId_1_driveId_1 does not exist or already dropped');
    }

    // Create new partial indexes
    await collection.createIndex(
      { userId: 1, roleId: 1 }, 
      { 
        unique: true, 
        partialFilterExpression: { roleId: { $exists: true, $type: "objectId" } },
        name: 'userId_1_roleId_1_partial'
      }
    );
    console.log('Created partial index for userId + roleId');

    await collection.createIndex(
      { userId: 1, driveId: 1 }, 
      { 
        unique: true, 
        partialFilterExpression: { driveId: { $exists: true, $type: "objectId" } },
        name: 'userId_1_driveId_1_partial'
      }
    );
    console.log('Created partial index for userId + driveId');

    // List all indexes to verify
    const indexes = await collection.listIndexes().toArray();
    console.log('\nCurrent indexes:');
    indexes.forEach(index => {
      console.log(`- ${index.name}: ${JSON.stringify(index.key)}`);
      if (index.partialFilterExpression) {
        console.log(`  Partial filter: ${JSON.stringify(index.partialFilterExpression)}`);
      }
    });

    console.log('\nIndexes fixed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing indexes:', error);
    process.exit(1);
  }
};

fixIndexes();