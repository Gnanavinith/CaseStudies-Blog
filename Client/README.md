# Case Studies Blog - Client

This is the frontend application for the Case Studies Blog platform, built with React, Vite, and Tailwind CSS.

## Features

- **User Authentication**: Complete login/signup system with JWT
- **User Profiles**: Comprehensive profile management with MongoDB integration
- **Responsive Design**: Modern, mobile-first UI built with Tailwind CSS
- **Protected Routes**: Secure access to user-specific content
- **Case Studies**: Browse and read detailed case studies
- **Blog System**: Access to blog articles and content
- **Search Functionality**: Find content quickly and easily

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB server running (see Server README)

## Installation

1. **Navigate to the client directory:**
   ```bash
   cd Client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser and navigate to:** `http://localhost:5173`

## User Profile System

### After Login
- Users are automatically redirected to their profile page (`/profile`)
- Profile data is fetched from MongoDB and displayed
- All profile updates are saved to MongoDB in real-time

### Profile Features
- **Personal Information**: Name, email, bio, company, position
- **Social Links**: LinkedIn, Twitter, GitHub profiles
- **Website**: Personal or company website
- **Statistics**: Reading history, likes, bookmarks
- **Edit Mode**: Inline editing with save/cancel functionality

### Profile Data Storage
- All profile information is stored in MongoDB
- Data is automatically synced between frontend and backend
- Real-time updates with immediate feedback
- Secure data transmission with JWT authentication

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
Client/
├── src/
│   ├── Components/          # Reusable UI components
│   │   ├── AuthForms.jsx    # Authentication forms
│   │   ├── AuthModal.jsx    # Authentication modal
│   │   ├── Hero.jsx         # Hero section component
│   │   ├── Navbar.jsx       # Navigation bar
│   │   ├── ProtectedRoute.jsx # Route protection
│   │   └── SearchBar.jsx    # Search functionality
│   ├── contexts/            # React contexts
│   │   └── AuthContext.jsx  # Authentication context
│   ├── Pages/               # Page components
│   │   ├── Profile.jsx      # User profile page
│   │   ├── SignIn.jsx       # Sign in page
│   │   ├── SignUp.jsx       # Sign up page
│   │   ├── Home.jsx         # Home page
│   │   └── ...              # Other pages
│   ├── App.jsx              # Main app component
│   └── main.jsx             # App entry point
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
└── vite.config.js          # Vite configuration
```

## Authentication Flow

1. **Registration**: Users create accounts with name, email, and password
2. **Login**: Users authenticate with email and password
3. **Profile Redirect**: After successful login, users are redirected to `/profile`
4. **Profile Management**: Users can view and edit their profile information
5. **Data Persistence**: All changes are saved to MongoDB via the backend API

## API Integration

The client communicates with the backend server at `http://localhost:5000`:

- **Authentication**: `/api/auth/*` endpoints for login, register, profile updates
- **User Data**: Profile information and user statistics
- **Content**: Blogs and case studies data
- **Real-time Updates**: Immediate feedback for user actions

## Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Modern UI**: Clean, professional interface
- **Dark Mode Ready**: Prepared for future dark mode implementation

## Development

### Hot Reload
- Changes are reflected immediately in the browser
- No need to manually refresh the page
- Fast development iteration

### State Management
- React Context API for global state
- Local state for component-specific data
- Automatic re-renders on state changes

### Error Handling
- Comprehensive error messages
- User-friendly error displays
- Graceful fallbacks for failed operations

## Production Build

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Preview the build:**
   ```bash
   npm run preview
   ```

3. **Deploy the `dist` folder** to your hosting service

## Environment Variables

Create a `.env` file in the Client directory if needed:

```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=Case Studies Blog
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Common Issues

1. **Server Connection Error**
   - Ensure the backend server is running on port 5000
   - Check CORS configuration in the backend

2. **Profile Not Loading**
   - Verify MongoDB is running
   - Check browser console for errors
   - Ensure JWT token is valid

3. **Build Errors**
   - Clear `node_modules` and reinstall
   - Check for syntax errors in components
   - Verify all imports are correct

### Development Tips

- Use browser developer tools to debug
- Check the Network tab for API calls
- Monitor console for error messages
- Use React DevTools for component debugging

## Contributing

1. Follow the existing code style
2. Test your changes thoroughly
3. Ensure responsive design works on all screen sizes
4. Update documentation if needed

## Support

For issues and questions:
1. Check the browser console for errors
2. Verify the backend server is running
3. Ensure MongoDB is accessible
4. Check the Network tab for failed API calls
