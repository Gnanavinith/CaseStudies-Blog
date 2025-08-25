# Case Studies Blog - Server

This is the backend server for the Case Studies Blog application, built with Node.js, Express, and MongoDB.

## Features

- User authentication and authorization with JWT
- User profile management
- Blog and case study management
- MongoDB integration
- RESTful API endpoints
- Rate limiting and security features

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. **Clone the repository and navigate to the server directory:**
   ```bash
   cd Server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the Server directory with the following variables:
   ```env
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
   ```

## MongoDB Setup

1. **Install MongoDB:**
   - **Windows:** Download and install from [MongoDB website](https://www.mongodb.com/try/download/community)
   - **macOS:** `brew install mongodb-community`
   - **Linux:** Follow [MongoDB installation guide](https://docs.mongodb.com/manual/installation/)

2. **Start MongoDB service:**
   - **Windows:** MongoDB runs as a service automatically
   - **macOS:** `brew services start mongodb-community`
   - **Linux:** `sudo systemctl start mongod`

3. **Verify MongoDB is running:**
   ```bash
   mongosh
   # or
   mongo
   ```

4. **Create database:**
   ```bash
   use case-studies-blog
   ```

## Running the Server

1. **Start the server:**
   ```bash
   npm start
   # or for development with nodemon
   npm run dev
   ```

2. **The server will start on:** `http://localhost:5000`

3. **Check server health:**
   ```bash
   curl http://localhost:5000/health
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

### Blogs
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get blog by ID
- `POST /api/blogs` - Create new blog (author/admin only)
- `PUT /api/blogs/:id` - Update blog (author/admin only)
- `DELETE /api/blogs/:id` - Delete blog (author/admin only)

### Case Studies
- `GET /api/case-studies` - Get all case studies
- `GET /api/case-studies/:id` - Get case study by ID
- `POST /api/case-studies` - Create new case study (author/admin only)
- `PUT /api/case-studies/:id` - Update case study (author/admin only)
- `DELETE /api/case-studies/:id` - Delete case study (author/admin only)

## Database Schema

### User Model
- Basic info: name, email, password
- Profile: bio, company, position, website
- Social links: LinkedIn, Twitter, GitHub
- Preferences: categories, newsletter
- Stats: articles read, case studies read, bookmarks
- Role: user, author, admin

### Blog Model
- Title, content, excerpt
- Author, category, tags
- Status: draft, published
- Timestamps

### Case Study Model
- Title, content, summary
- Company, industry, results
- Author, category, tags
- Status: draft, published
- Timestamps

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS configuration
- Input validation
- Error handling

## Development

- **Hot reload:** Use `npm run dev` for development
- **Environment:** Set `NODE_ENV=development` for detailed error messages
- **Logging:** Check console for detailed logs
- **Database:** Use MongoDB Compass for database visualization

## Production Deployment

1. **Set production environment variables:**
   - Use strong JWT secret
   - Set proper MongoDB URI
   - Configure CORS for production domain
   - Set up proper logging

2. **Use PM2 or similar process manager:**
   ```bash
   npm install -g pm2
   pm2 start server.js --name "case-studies-blog"
   ```

3. **Set up reverse proxy (nginx) for production**

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB service is running
- Check MongoDB URI in .env file
- Verify MongoDB port (default: 27017)
- Check firewall settings

### JWT Issues
- Verify JWT_SECRET is set
- Check token expiration
- Ensure proper Authorization header format

### CORS Issues
- Verify FRONTEND_URL in .env
- Check browser console for CORS errors
- Ensure frontend is running on specified port

## Support

For issues and questions:
1. Check the logs in the console
2. Verify environment variables
3. Ensure MongoDB is running
4. Check API endpoint documentation
