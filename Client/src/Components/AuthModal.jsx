import React, { useState } from 'react';
import { X } from 'lucide-react';
import AuthForms from './AuthForms';
import { useAuth } from '../contexts/AuthContext';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);
  const { user } = useAuth();

  // Close modal if user is already authenticated
  React.useEffect(() => {
    if (user && isOpen) {
      onClose();
    }
  }, [user, isOpen, onClose]);

  const handleSwitchMode = (newMode) => {
    setMode(newMode);
  };

  const handleSuccess = () => {
    onClose();
    // Reset to login mode for next time
    setMode('login');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative w-full max-w-md mx-auto z-[10000]">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 z-[10001] w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
          >
            <X size={20} className="text-gray-600" />
          </button>
          
          {/* Auth Forms */}
          <AuthForms
            mode={mode}
            onSuccess={handleSuccess}
            onSwitchMode={handleSwitchMode}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
