@echo off
chcp 65001 >nul
echo 🚀 Setting up Case Studies Blog...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v16 or higher first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=1,2 delims=." %%a in ('node --version') do set NODE_VERSION=%%a
set NODE_VERSION=%NODE_VERSION:~1%
if %NODE_VERSION% lss 16 (
    echo ❌ Node.js version 16 or higher is required. Current version: 
    node --version
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Check if MongoDB is installed
mongosh --version >nul 2>&1
if %errorlevel% neq 0 (
    mongo --version >nul 2>&1
    if %errorlevel% neq 0 (
        echo ⚠️  MongoDB is not installed or not in PATH.
        echo    Please install MongoDB first:
        echo    - Download from https://www.mongodb.com/try/download/community
        echo    - Install with default settings
        echo    - MongoDB runs as a Windows service automatically
        echo.
        echo    After installation, run this script again.
        pause
        exit /b 1
    )
)

echo ✅ MongoDB is available

REM Try to connect to MongoDB
echo 🔍 Checking MongoDB connection...
mongosh --eval "db.runCommand('ping')" >nul 2>&1
if %errorlevel% neq 0 (
    mongo --eval "db.runCommand('ping')" >nul 2>&1
    if %errorlevel% neq 0 (
        echo ❌ Cannot connect to MongoDB. Please ensure MongoDB service is running.
        echo    MongoDB should run as a Windows service automatically.
        echo    Check Services app (services.msc) for MongoDB service.
        pause
        exit /b 1
    )
)

echo ✅ MongoDB is running

REM Create database
echo 🗄️  Creating database...
mongosh --eval "use case-studies-blog" >nul 2>&1
if %errorlevel% neq 0 (
    mongo --eval "use case-studies-blog" >nul 2>&1
    if %errorlevel% neq 0 (
        echo ⚠️  Could not create database. This is okay if it already exists.
    )
)

echo ✅ Database 'case-studies-blog' is ready

REM Backend setup
echo.
echo 🔧 Setting up backend...
cd Server

REM Install dependencies
echo 📦 Installing backend dependencies...
call npm install

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file...
    (
        echo # Server Configuration
        echo PORT=5000
        echo NODE_ENV=development
        echo.
        echo # Database Configuration
        echo MONGODB_URI=mongodb://localhost:27017/case-studies-blog
        echo.
        echo # JWT Configuration
        echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
        echo JWT_EXPIRES_IN=7d
        echo.
        echo # Frontend URL ^(for CORS^)
        echo FRONTEND_URL=http://localhost:5173
        echo.
        echo # Rate Limiting
        echo RATE_LIMIT_WINDOW_MS=900000
        echo RATE_LIMIT_MAX_REQUESTS=100
        echo.
        echo # File Upload
        echo MAX_FILE_SIZE=5242880
        echo ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf
        echo.
        echo # Email Configuration ^(for password reset^)
        echo SMTP_HOST=smtp.gmail.com
        echo SMTP_PORT=587
        echo SMTP_USER=your-email@gmail.com
        echo SMTP_PASS=your-app-password
    ) > .env
    echo ✅ .env file created
) else (
    echo ✅ .env file already exists
)

cd ..

REM Frontend setup
echo.
echo 🎨 Setting up frontend...
cd Client

REM Install dependencies
echo 📦 Installing frontend dependencies...
call npm install

cd ..

echo.
echo 🎉 Setup complete!
echo.
echo 📋 Next steps:
echo 1. Start the backend server:
echo    cd Server ^&^& npm run dev
echo.
echo 2. In a new terminal, start the frontend:
echo    cd Client ^&^& npm run dev
echo.
echo 3. Open your browser and go to: http://localhost:5173
echo.
echo 4. Try to register a new user and login to test the profile system
echo.
echo 📚 For more information, check the README.md file
echo.
echo 🚀 Happy coding!
pause
