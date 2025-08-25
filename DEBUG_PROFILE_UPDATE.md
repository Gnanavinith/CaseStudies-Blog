# 🐛 Debug Profile Update 500 Error

## 🚨 **The Problem**
Your frontend is working, but the profile update request to `http://localhost:5000/api/auth/profile` returns 500 (Internal Server Error).

## 🔍 **Step-by-Step Debugging**

### 1. **Test Basic Server Connectivity**

First, test if your server is even running:

```bash
# Test if server responds
curl http://localhost:5000/

# Expected: {"message":"Case Studies & Blogs API is running!","version":"1.0.0",...}
```

### 2. **Test Auth Route**

Test if the auth route is accessible:

```bash
# Test public auth endpoint
curl http://localhost:5000/api/auth/test

# Expected: {"message":"Auth route is working!","timestamp":"...",...}
```

### 3. **Test Auth Middleware**

Test if the auth middleware works:

```bash
# This should fail (no token)
curl http://localhost:5000/api/auth/test-auth

# Expected: {"message":"Access denied. No token provided."}
```

### 4. **Check Server Logs**

Start your server and watch the console:

```bash
cd Server
npm run dev
```

**Look for these logs when you try to update profile:**

```
🔐 Auth middleware - checking request headers
🔐 Authorization header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
🔐 Token extracted: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
🔐 JWT verified successfully, userId: 507f1f77bcf86cd799439011
✅ User authenticated successfully: user@example.com
🔍 Profile update request received: { userId: "507f1f77bcf86cd799439011", ... }
```

### 5. **Common Issues & Solutions**

#### ❌ **Issue: Server Not Running**
**Symptoms:**
- `curl: (7) Failed to connect to localhost port 5000`
- Frontend shows "Failed to fetch"

**Solution:**
```bash
cd Server
npm run dev
```

#### ❌ **Issue: MongoDB Not Connected**
**Symptoms:**
- Server shows "⚠️ MongoDB disconnected"
- Connection state is not 1

**Solution:**
```bash
# Windows: Check Services app for MongoDB
# macOS: brew services restart mongodb-community
# Linux: sudo systemctl restart mongod
```

#### ❌ **Issue: JWT Token Invalid**
**Symptoms:**
- "JWT verification failed" in logs
- "Invalid token" response

**Solution:**
- Re-login to get a fresh token
- Check if JWT_SECRET is set correctly

#### ❌ **Issue: User Not Found**
**Symptoms:**
- "User not found in database" in logs
- User exists in frontend but not in DB

**Solution:**
- Re-register the user
- Check if user was properly saved during registration

#### ❌ **Issue: Validation Errors**
**Symptoms:**
- "Validation failed" response
- Specific field validation errors

**Solution:**
- Check the data being sent
- Ensure required fields are provided
- Check field length limits

### 6. **Test Complete Flow**

1. **Start MongoDB**
2. **Start Backend Server** - Watch for connection logs
3. **Start Frontend**
4. **Register a new user** - Check server logs
5. **Login with the user** - Check server logs
6. **Go to Profile page**
7. **Try to edit and save profile** - Watch server logs carefully

### 7. **Check Network Tab**

In browser DevTools → Network tab:

1. **Try to update profile**
2. **Look for PUT request to `/api/auth/profile`**
3. **Check:**
   - **Request Headers**: Should have `Authorization: Bearer <token>`
   - **Request Payload**: Should contain profile data
   - **Response Status**: Should be 200, not 500
   - **Response Body**: Should contain updated user data

### 8. **Debug Specific Errors**

#### **CastError**
```
❌ Profile update error: CastError: Cast to ObjectId failed for value "..." at path "_id"
```
**Cause:** Invalid user ID format
**Solution:** Check JWT token and user authentication

#### **ValidationError**
```
❌ Profile update error: ValidationError: Path `field` is required
```
**Cause:** Required field missing
**Solution:** Check frontend data being sent

#### **MongoDB Connection Error**
```
❌ MongoDB connection error: connect ECONNREFUSED 127.0.0.1:27017
```
**Cause:** MongoDB not running
**Solution:** Start MongoDB service

### 9. **Quick Fix Commands**

```bash
# Test MongoDB connection
mongosh --eval "db.runCommand('ping')"

# Test backend health
curl http://localhost:5000/health

# Test auth route
curl http://localhost:5000/api/auth/test

# Check server logs
cd Server && npm run dev
```

### 10. **Reset Everything**

If nothing works:

```bash
# Stop all servers
# Restart MongoDB
# Clear database
mongosh
use case-studies-blog
db.dropDatabase()
exit

# Restart backend
cd Server && npm run dev

# Restart frontend
cd Client && npm run dev

# Register new user and test
```

## 🎯 **Expected Success Flow**

When profile update works, you should see:

```
🔐 Auth middleware - checking request headers
🔐 Authorization header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
🔐 Token extracted: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
🔐 JWT verified successfully, userId: 507f1f77bcf86cd799439011
✅ User authenticated successfully: user@example.com
🔍 Profile update request received: { userId: "507f1f77bcf86cd799439011", ... }
✅ User found in database: user@example.com
✅ User updated successfully: user@example.com
📝 Updated fields: ["name", "bio"]
```

## 📞 **Still Having Issues?**

1. **Check server console** for detailed error logs
2. **Run the test endpoints** to isolate the problem
3. **Check MongoDB status** and restart if needed
4. **Verify JWT token** is valid and contains userId
5. **Check if user exists** in the database

The enhanced logging should now show exactly where the 500 error is occurring! 🚀
