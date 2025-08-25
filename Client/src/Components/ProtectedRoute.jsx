import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAuth = true, requireAuthor = false }) => {
  const { user, isAuthenticated, canCreateContent } = useAuth();

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  // If author role is required but user doesn't have it
  if (requireAuthor && !canCreateContent()) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
          <p className="text-sm text-gray-500">Only authorized users can create content.</p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
