const mongoose = require('mongoose');
require('dotenv').config();

const config = require('./config');

async function testMongoDB() {
  console.log('🧪 Testing MongoDB connection...');
  console.log('📊 MongoDB URI:', config.mongodbUri);
  
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongodbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connected successfully');
    console.log('🔗 Connection state:', mongoose.connection.readyState);
    
    // Test basic operations
    const User = require('./models/User');
    
    // Test finding users
    console.log('🔍 Testing user find operation...');
    const users = await User.find().limit(1);
    console.log('✅ User find operation successful');
    console.log('👥 Users found:', users.length);
    
    // Test creating a test user (if no users exist)
    if (users.length === 0) {
      console.log('📝 Creating test user...');
      const testUser = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
      
      await testUser.save();
      console.log('✅ Test user created successfully');
      
      // Clean up test user
      await User.deleteOne({ email: 'test@example.com' });
      console.log('🧹 Test user cleaned up');
    }
    
    // Test update operation
    if (users.length > 0) {
      console.log('📝 Testing update operation...');
      const user = users[0];
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { bio: 'Test bio update' },
        { new: true }
      );
      console.log('✅ Update operation successful');
      console.log('📝 Updated bio:', updatedUser.bio);
      
      // Revert the change
      await User.findByIdAndUpdate(
        user._id,
        { bio: user.bio || '' },
        { new: true }
      );
      console.log('🔄 Bio reverted to original');
    }
    
    console.log('🎉 All MongoDB tests passed!');
    
  } catch (error) {
    console.error('❌ MongoDB test failed:', error);
    console.error('❌ Error details:', {
      name: error.name,
      message: error.message,
      code: error.code
    });
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
    process.exit(0);
  }
}

// Run the test
testMongoDB();
