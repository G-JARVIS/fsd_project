// backend/truncateDatabase.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const truncateDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all collections
    const collections = await mongoose.connection.db.collections();

    console.log('🗑️  Starting database truncation...\n');

    // Truncate each collection
    for (let collection of collections) {
      const collectionName = collection.collectionName;
      const result = await collection.deleteMany({});
      console.log(`✅ Truncated collection: ${collectionName} (${result.deletedCount} documents)`);
    }

    console.log('\n🎉 Database truncation completed successfully!');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error truncating database:', error.message);
    process.exit(1);
  }
};

// Confirm before truncating
console.log('⚠️  WARNING: This will delete ALL data from your database!');
console.log('   This action cannot be undone.\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Are you sure you want to continue? (yes/no): ', (answer) => {
  if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
    console.log('\nProceeding with database truncation...\n');
    truncateDatabase();
  } else {
    console.log('Database truncation cancelled.');
    process.exit(0);
  }
  rl.close();
});