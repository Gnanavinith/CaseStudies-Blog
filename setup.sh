#!/bin/bash

# Case Studies Blog - Setup Script
# This script helps you set up the project quickly

echo "🚀 Setting up Case Studies Blog..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if MongoDB is running
if ! command -v mongosh &> /dev/null && ! command -v mongo &> /dev/null; then
    echo "⚠️  MongoDB is not installed or not in PATH."
    echo "   Please install MongoDB first:"
    echo "   - Windows: Download from https://www.mongodb.com/try/download/community"
    echo "   - macOS: brew install mongodb-community"
    echo "   - Linux: sudo apt install mongodb"
    echo ""
    echo "   After installation, start MongoDB and run this script again."
    exit 1
fi

# Try to connect to MongoDB
echo "🔍 Checking MongoDB connection..."
if mongosh --eval "db.runCommand('ping')" &> /dev/null || mongo --eval "db.runCommand('ping')" &> /dev/null; then
    echo "✅ MongoDB is running"
else
    echo "❌ Cannot connect to MongoDB. Please ensure MongoDB service is running."
    echo "   - Windows: MongoDB runs as a service automatically"
    echo "   - macOS: brew services start mongodb-community"
    echo "   - Linux: sudo systemctl start mongod"
    exit 1
fi

# Create database
echo "🗄️  Creating database..."
if mongosh --eval "use case-studies-blog" &> /dev/null || mongo --eval "use case-studies-blog" &> /dev/null; then
    echo "✅ Database 'case-studies-blog' is ready"
else
    echo "⚠️  Could not create database. This is okay if it already exists."
fi

# Backend setup
echo ""
echo "🔧 Setting up backend..."
cd Server

# Install dependencies
echo "📦 Installing backend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/case-studies-blog

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf

# Email Configuration (for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EOF
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

cd ..

# Frontend setup
echo ""
echo "🎨 Setting up frontend..."
cd Client

# Install dependencies
echo "📦 Installing frontend dependencies..."
npm install

cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Start the backend server:"
echo "   cd Server && npm run dev"
echo ""
echo "2. In a new terminal, start the frontend:"
echo "   cd Client && npm run dev"
echo ""
echo "3. Open your browser and go to: http://localhost:5173"
echo ""
echo "4. Try to register a new user and login to test the profile system"
echo ""
echo "📚 For more information, check the README.md file"
echo ""
echo "🚀 Happy coding!"
