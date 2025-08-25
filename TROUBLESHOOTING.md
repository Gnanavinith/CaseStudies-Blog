# 🔧 Troubleshooting Guide - Profile Update 500 Error

## 🚨 Problem
Getting a 500 Internal Server Error when trying to update profile:
```
Failed to load resource: the server responded with a status of 500 (Internal Server Error)
Profile update error: Error: Server error while updating profile
```

## 🔍 Step-by-Step Debugging

### 1. **Check if MongoDB is Running**

#### Windows
```bash
# Check Services app (services.msc)
# Look for "MongoDB" service - should be "Running"
```

#### macOS/Linux
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB if not running
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### 2. **Test MongoDB Connection**

Run the test script to verify MongoDB connectivity:

```bash
cd Server
node test-mongodb.js
```

**Expected Output:**
```
🧪 Testing MongoDB connection...
📊 MongoDB URI: mongodb://localhost:27017/case-studies-blog
✅ MongoDB connected successfully
🔗 Connection state: 1
🔍 Testing user find operation...
✅ User find operation successful
👥 Users found: X
🎉 All MongoDB tests passed!
🔌 MongoDB connection closed
```

**If you get errors:**
- MongoDB is not running
- MongoDB is not accessible on the expected port
- Authentication issues

### 3. **Check Server Status**

Make sure the backend server is running:

```bash
cd Server
npm run dev
```

**Expected Output:**
```
🚀 Server is running on port 5000
🌍 Environment: development
🔗 Frontend URL: http://localhost:5173
📅 Started at: [timestamp]
✅ Connected to MongoDB successfully
📊 Database: mongodb://localhost:27017/case-studies-blog
🔗 Connection state: 1
```

### 4. **Check Server Logs**

When you try to update the profile, look for these logs in the server console:

```
🔍 Profile update request received: { userId: "...", body: {...}, user: {...} }
📝 Allowed updates: ['name', 'bio', 'company', 'position', 'website', 'socialLinks', 'preferences']
📝 Requested updates: {...}
✅ Filtered updates: {...}
✅ User found in database: user@example.com
✅ User updated successfully: user@example.com
```

**If you see errors, they will show:**
```
❌ Profile update error: [error details]
❌ Error stack: [stack trace]
❌ Error details: { name: "...", message: "...", code: "..." }
```

### 5. **Common Issues & Solutions**

#### Issue: MongoDB Connection Lost
**Symptoms:**
- Server shows "⚠️ MongoDB disconnected"
- Connection state is not 1

**Solution:**
```bash
# Restart MongoDB service
# Windows: Restart MongoDB service in Services
# macOS: brew services restart mongodb-community
# Linux: sudo systemctl restart mongod
```

#### Issue: Database Doesn't Exist
**Symptoms:**
- "Database not found" errors
- Connection succeeds but operations fail

**Solution:**
```bash
# Connect to MongoDB and create database
mongosh
use case-studies-blog
# Database will be created automatically
```

#### Issue: User Not Found
**Symptoms:**
- "User not found in database" error
- JWT token is valid but user doesn't exist in DB

**Solution:**
- Re-register the user
- Check if the user was properly saved during registration

#### Issue: Validation Errors
**Symptoms:**
- "Validation failed" error
- Specific field validation errors

**Solution:**
- Check the data being sent (look at server logs)
- Ensure required fields are provided
- Check field length limits

### 6. **Test the Complete Flow**

1. **Start MongoDB**
2. **Start Backend Server**
3. **Start Frontend**
4. **Register a new user**
5. **Login with the user**
6. **Go to Profile page**
7. **Try to edit and save profile**

### 7. **Check Network Tab**

In browser DevTools → Network tab:
1. Try to update profile
2. Look for the PUT request to `/api/auth/profile`
3. Check:
   - Request payload (should contain profile data)
   - Response status (should be 200, not 500)
   - Response body (should contain updated user data)

### 8. **Environment Variables**

Ensure your `.env` file in the Server directory has:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/case-studies-blog
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=http://localhost:5173
```

### 9. **Reset Everything**

If nothing works, try a complete reset:

```bash
# Stop all servers
# Restart MongoDB
# Clear any existing data
mongosh
use case-studies-blog
db.dropDatabase()
exit

# Restart backend server
cd Server
npm run dev

# Restart frontend
cd Client
npm run dev

# Register a new user and test
```

## 📞 **Still Having Issues?**

1. **Check server console** for detailed error logs
2. **Run the MongoDB test script** to verify connectivity
3. **Check MongoDB status** and restart if needed
4. **Verify all environment variables** are set correctly
5. **Check if the user exists** in the database

## 🔗 **Useful Commands**

```bash
# Check MongoDB status
mongosh --eval "db.runCommand('ping')"

# Check database contents
mongosh
use case-studies-blog
db.users.find()

# Check specific user
db.users.findOne({email: "your-email@example.com"})

# Test backend health
curl http://localhost:5000/health
```

The enhanced error logging should now give you much more detailed information about what's causing the 500 error! 🎯
