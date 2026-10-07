const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/opspilot';

  // Attempt 1: Local / Configured MongoDB instance
  try {
    console.log(`📡 Connecting to Primary MongoDB instance...`);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    console.log('✅ Connected to Primary MongoDB instance successfully.');
    return;
  } catch (err) {
    console.warn('⚠️ Could not connect to primary local MongoDB instance:', err.message);
  }

  // Attempt 2: Ultra-Fast Lightweight In-Memory MongoDB Server (v4.4 binary)
  try {
    console.log('🔄 Launching Lightweight In-Memory MongoDB instance fallback...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create({
      binary: {
        version: '4.4.18',
      },
    });
    const memoryUri = mongoServer.getUri();
    await mongoose.connect(memoryUri);
    console.log(`✅ Connected to In-Memory MongoDB successfully at ${memoryUri}`);
  } catch (memErr) {
    console.error('❌ Failed to start In-Memory MongoDB:', memErr.message);
  }
};

module.exports = connectDB;
