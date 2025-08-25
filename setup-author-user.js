#!/usr/bin/env node

/**
 * Setup Author User Script
 * This script helps set up the authorized user for content creation
 * 
 * Usage: node setup-author-user.js
 */

const readline = require('readline');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// User model (simplified for this script)
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ['user', 'admin', 'author'],
    default: 'user'
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function setupAuthorUser() {
  console.log('🚀 Setting up Author User for Case Studies Blog\n');
  
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/case-studies-blog';
    console.log(`📊 Connecting to MongoDB: ${mongoUri}`);
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB successfully\n');
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: 'hellotanglome@gmail.com' });
    
    if (existingUser) {
      console.log('👤 User already exists:');
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Name: ${existingUser.name}`);
      console.log(`   Role: ${existingUser.role}`);
      
      if (existingUser.role === 'author') {
        console.log('✅ User already has author role!');
      } else {
        console.log('🔄 Updating user role to author...');
        existingUser.role = 'author';
        await existingUser.save();
        console.log('✅ User role updated to author!');
      }
    } else {
      console.log('📝 Creating new author user...');
      
      // Hash password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash('Tanglome@123', salt);
      
      // Create user
      const newUser = new User({
        name: 'Tanglome Author',
        email: 'hellotanglome@gmail.com',
        password: hashedPassword,
        role: 'author'
      });
      
      await newUser.save();
      console.log('✅ Author user created successfully!');
      console.log(`   Email: ${newUser.email}`);
      console.log(`   Name: ${newUser.name}`);
      console.log(`   Role: ${newUser.role}`);
    }
    
    console.log('\n🎉 Setup complete!');
    console.log('\n📋 Login Credentials:');
    console.log('   Email: hellotanglome@gmail.com');
    console.log('   Password: Tanglome@123');
    console.log('\n🔐 This user can now:');
    console.log('   - Create case studies');
    console.log('   - Create blog posts');
    console.log('   - Access the Create button in the navbar');
    
  } catch (error) {
    console.error('❌ Error setting up author user:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    rl.close();
  }
}

// Run the setup
setupAuthorUser();
