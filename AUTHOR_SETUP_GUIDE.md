# 🔐 Author User Setup Guide

## 🎯 **Overview**

This guide explains how to set up role-based access control for the Case Studies Blog platform. Only users with the email `hellotanglome@gmail.com` and password `Tanglome@123` can create case studies and blog posts.

## 🚀 **Quick Setup**

### 1. **Run the Setup Script**

```bash
# Navigate to the project root
cd /path/to/your/project

# Run the author user setup script
node setup-author-user.js
```

**Expected Output:**
```
🚀 Setting up Author User for Case Studies Blog

📊 Connecting to MongoDB: mongodb://localhost:27017/case-studies-blog
✅ Connected to MongoDB successfully

📝 Creating new author user...
✅ Author user created successfully!
   Email: hellotanglome@gmail.com
   Name: Tanglome Author
   Role: author

🎉 Setup complete!

📋 Login Credentials:
   Email: hellotanglome@gmail.com
   Password: Tanglome@123

🔐 This user can now:
   - Create case studies
   - Create blog posts
   - Access the Create button in the navbar
```

### 2. **Manual Setup (Alternative)**

If you prefer to set up manually:

```bash
# 1. Start MongoDB
# 2. Start the backend server
cd Server && npm run dev

# 3. Register a new user with:
#    Email: hellotanglome@gmail.com
#    Password: Tanglome@123
#    Name: Your Name

# 4. The system will automatically assign the "author" role
```

## 🔐 **How It Works**

### **Backend Role Assignment**

The system automatically assigns the "author" role to users with the specific email:

```javascript
// In Server/routes/auth.js
if (email === 'hellotanglome@gmail.com') {
  userRole = 'author';
  console.log('🎭 Assigning author role to:', email);
}
```

### **Frontend Authorization**

The frontend checks user roles and shows/hides features accordingly:

```javascript
// In Client/src/contexts/AuthContext.jsx
const isAuthor = () => {
  return user && user.role === 'author';
};

const canCreateContent = () => {
  return isAuthor();
};
```

### **Protected Routes**

Content creation routes are protected with role-based access:

```javascript
// In Client/src/App.jsx
<Route path="/create" element={
  <ProtectedRoute requireAuth={true} requireAuthor={true}>
    <CreateContent />
  </ProtectedRoute>
} />
```

## 🎨 **UI Changes**

### **Navbar Create Button**

- **Visible to:** Users with "author" role
- **Hidden from:** Regular users and guests
- **Appearance:** Green button with "+" icon
- **Location:** Between "Blog" and "Pricing" buttons

### **Profile Page**

- **Role Display:** Shows user's role (User/Author/Admin)
- **Role Badge:** Color-coded role indicator
- **Author Badge:** Blue background for authors

### **Create Content Page**

- **Access:** Only for authenticated authors
- **Features:** 
  - Case study creation
  - Blog post creation
  - Category selection
  - Tag management
  - Rich content editor

## 🛡️ **Security Features**

### **Backend Protection**

1. **JWT Authentication:** All routes require valid tokens
2. **Role Verification:** Author routes check user roles
3. **Middleware Chain:** `auth` → `requireAuthor` → route handler

### **Frontend Protection**

1. **Route Guards:** Protected routes redirect unauthorized users
2. **Conditional Rendering:** UI elements only show for authorized users
3. **Context Validation:** Real-time role checking

## 🔍 **Testing the Setup**

### 1. **Test Regular User Access**

```bash
# Register/login with a different email
# Expected: No Create button visible
# Expected: Cannot access /create route
```

### 2. **Test Author User Access**

```bash
# Login with hellotanglome@gmail.com / Tanglome@123
# Expected: Green Create button visible
# Expected: Can access /create route
# Expected: Can create case studies and blogs
```

### 3. **Test API Endpoints**

```bash
# Test without authentication
curl http://localhost:5000/api/auth/test-auth
# Expected: 401 Unauthorized

# Test with regular user token
# Expected: 403 Forbidden for author-only routes

# Test with author user token
# Expected: 200 OK for author routes
```

## 🚨 **Troubleshooting**

### **Common Issues**

#### **User Not Getting Author Role**

**Symptoms:**
- User exists but role is still "user"
- Create button not visible

**Solutions:**
1. Check if email matches exactly: `hellotanglome@gmail.com`
2. Re-login to trigger role update
3. Run the setup script again

#### **Create Button Not Visible**

**Symptoms:**
- User is logged in but no Create button

**Solutions:**
1. Check browser console for errors
2. Verify user.role === 'author' in AuthContext
3. Check if user data is properly loaded

#### **Access Denied on Create Page**

**Symptoms:**
- 403 Forbidden error
- "Access Denied" message

**Solutions:**
1. Verify user has author role
2. Check JWT token validity
3. Ensure backend is running

### **Debug Commands**

```bash
# Check MongoDB connection
mongosh --eval "db.runCommand('ping')"

# Check user in database
mongosh
use case-studies-blog
db.users.findOne({email: "hellotanglome@gmail.com"})

# Check backend logs
cd Server && npm run dev
```

## 📋 **API Endpoints**

### **Public Routes**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/auth/test` - Test endpoint

### **Protected Routes**
- `GET /api/auth/me` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `GET /api/auth/test-auth` - Test authentication

### **Author-Only Routes**
- `POST /api/case-studies` - Create case study
- `POST /api/blogs` - Create blog post
- `PUT /api/case-studies/:id` - Update case study
- `DELETE /api/case-studies/:id` - Delete case study

## 🎉 **Success Indicators**

When everything is working correctly:

1. ✅ **User with `hellotanglome@gmail.com` gets "author" role automatically**
2. ✅ **Green Create button appears in navbar for authors only**
3. ✅ **Regular users cannot see Create button**
4. ✅ **Author users can access `/create` route**
5. ✅ **Unauthorized users get "Access Denied" message**
6. ✅ **Profile page shows correct role badge**
7. ✅ **Backend logs show role assignments**

## 🔄 **Updating Existing Users**

If you need to update an existing user's role:

```bash
# Option 1: Use the setup script
node setup-author-user.js

# Option 2: Update manually in MongoDB
mongosh
use case-studies-blog
db.users.updateOne(
  {email: "hellotanglome@gmail.com"},
  {$set: {role: "author"}}
)
```

## 📞 **Support**

If you encounter issues:

1. **Check server logs** for detailed error messages
2. **Verify MongoDB connection** and user data
3. **Test with the setup script** to ensure proper configuration
4. **Check browser console** for frontend errors

The role-based access control is now fully implemented! 🎯
