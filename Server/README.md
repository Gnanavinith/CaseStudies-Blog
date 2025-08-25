# Case Studies & Blogs - Backend API

A comprehensive backend API for the Case Studies & Blogs platform built with Node.js, Express, and MongoDB.

## Features

- **User Authentication**: JWT-based authentication with registration, login, and password reset
- **Blog Management**: CRUD operations for blog posts with categories, tags, and engagement tracking
- **Case Studies**: Detailed case study management with industry categorization and metrics
- **User Profiles**: Comprehensive user profiles with preferences and statistics
- **Admin Panel**: Admin-only routes for user management and content moderation
- **Search & Filtering**: Advanced search and filtering capabilities
- **Pagination**: Efficient pagination for large datasets
- **Validation**: Input validation using express-validator
- **Security**: Password hashing, JWT tokens, and role-based access control

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Password Hashing**: bcryptjs
- **CORS**: Cross-origin resource sharing support

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## Installation

1. **Clone the repository and navigate to server directory**
   ```bash
   cd Server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment variables**
   Create a `.env` file in the server root directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/case-studies-blog

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

   # Optional: Email Configuration (for password reset)
   # SMTP_HOST=smtp.gmail.com
   # SMTP_PORT=587
   # SMTP_USER=your-email@gmail.com
   # SMTP_PASS=your-app-password
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system or update the MONGODB_URI in your .env file.

5. **Run the server**
   ```bash
   # Development mode with auto-restart
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000` (or the port specified in your .env file).

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/register` | User registration | Public |
| POST | `/login` | User login | Public |
| GET | `/me` | Get current user profile | Private |
| PUT | `/profile` | Update user profile | Private |
| PUT | `/password` | Change password | Private |
| POST | `/forgot-password` | Request password reset | Public |
| POST | `/reset-password` | Reset password with token | Public |

### Blog Routes (`/api/blogs`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all published blogs | Public |
| GET | `/featured` | Get featured blogs | Public |
| GET | `/category/:category` | Get blogs by category | Public |
| GET | `/search` | Search blogs | Public |
| GET | `/:slug` | Get blog by slug | Public |
| POST | `/` | Create new blog | Private |
| PUT | `/:id` | Update blog | Private (Owner/Admin) |
| DELETE | `/:id` | Delete blog | Private (Owner/Admin) |
| POST | `/:id/like` | Like/unlike blog | Private |
| POST | `/:id/bookmark` | Bookmark blog | Private |

### Case Study Routes (`/api/case-studies`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all published case studies | Public |
| GET | `/featured` | Get featured case studies | Public |
| GET | `/industry/:industry` | Get case studies by industry | Public |
| GET | `/category/:category` | Get case studies by category | Public |
| GET | `/search` | Search case studies | Public |
| GET | `/:slug` | Get case study by slug | Public |
| POST | `/` | Create new case study | Private |
| PUT | `/:id` | Update case study | Private (Owner/Admin) |
| DELETE | `/:id` | Delete case study | Private (Owner/Admin) |
| POST | `/:id/like` | Like/unlike case study | Private |
| POST | `/:id/bookmark` | Bookmark case study | Private |
| POST | `/:id/download` | Record case study download | Private |

### User Routes (`/api/users`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/profile` | Get current user profile | Private |
| PUT | `/profile` | Update current user profile | Private |
| GET | `/stats` | Get user statistics | Private |
| GET | `/content` | Get user's content | Private |
| GET | `/bookmarks` | Get user's bookmarks | Private |
| GET | `/reading-history` | Get user's reading history | Private |
| PUT | `/avatar` | Update user avatar | Private |
| DELETE | `/account` | Delete user account | Private |

### Admin Routes (`/api/users/admin`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/all` | Get all users | Admin |
| PUT | `/:id/role` | Update user role | Admin |
| DELETE | `/:id` | Delete user account | Admin |

## Data Models

### User Model
- Basic info: name, email, password
- Profile: bio, company, position, website, social links
- Preferences: categories, newsletter subscription
- Statistics: articles read, case studies read, bookmarks
- Authentication: verification status, reset tokens

### Blog Model
- Content: title, excerpt, content, featured image
- Metadata: author, category, tags, read time
- Status: draft, published, archived
- SEO: meta title, description, keywords
- Engagement: views, likes, shares, bookmarks, comments

### Case Study Model
- Content: title, company, industry, category
- Analysis: challenge, solution, methodology, results, key insights
- Metrics: revenue, users, conversion, efficiency
- Timeline: start/end dates, duration
- Team: size, roles, budget
- Tools and technologies used

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

The API returns consistent error responses:

```json
{
  "message": "Error description",
  "errors": [] // Validation errors if applicable
}
```

## Validation

All input is validated using express-validator with custom error messages for better user experience.

## Security Features

- Password hashing with bcryptjs
- JWT token expiration
- Role-based access control
- Input validation and sanitization
- CORS configuration

## Development

### Scripts
- `npm run dev`: Start development server with nodemon
- `npm start`: Start production server
- `npm test`: Run tests (to be implemented)

### File Structure
```
Server/
├── models/          # Database models
├── routes/          # API route handlers
├── middleware/      # Custom middleware (to be added)
├── utils/           # Utility functions (to be added)
├── server.js        # Main server file
├── package.json     # Dependencies and scripts
└── README.md        # This file
```

## Future Enhancements

- [ ] Email service integration
- [ ] File upload functionality
- [ ] Rate limiting
- [ ] Caching with Redis
- [ ] Analytics and reporting
- [ ] Webhook support
- [ ] API documentation with Swagger
- [ ] Testing suite
- [ ] Docker containerization
- [ ] CI/CD pipeline

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For questions or support, please open an issue in the repository.
