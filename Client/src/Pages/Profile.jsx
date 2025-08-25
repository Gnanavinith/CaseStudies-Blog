import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Building, Globe, Linkedin, Twitter, Github, Edit3, Save, AlertCircle, CheckCircle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    bio: '',
    company: '',
    position: '',
    website: '',
    socialLinks: {
      linkedin: '',
      twitter: '',
      github: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  // Initialize edit data when user data changes
  useEffect(() => {
    if (user) {
      setEditData({
        name: user.name || '',
        bio: user.bio || '',
        company: user.company || '',
        position: user.position || '',
        website: user.website || '',
        socialLinks: {
          linkedin: user.socialLinks?.linkedin || '',
          twitter: user.socialLinks?.twitter || '',
          github: user.socialLinks?.github || ''
        }
      });
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
    setMessage('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setMessage('');
    // Reset to original user data
    setEditData({
      name: user?.name || '',
      bio: user?.bio || '',
      company: user?.company || '',
      position: user?.position || '',
      website: user?.website || '',
      socialLinks: {
        linkedin: user?.socialLinks?.linkedin || '',
        twitter: user?.socialLinks?.twitter || '',
        github: user?.socialLinks?.github || ''
      }
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');

    try {
      // Validate required fields
      if (!editData.name.trim()) {
        setMessage('Name is required');
        setMessageType('error');
        return;
      }

      const result = await updateProfile(editData);
      if (result.success) {
        setMessage('Profile updated successfully!');
        setMessageType('success');
        setIsEditing(false);
        setTimeout(() => setMessage(''), 3000);
    } else {
        setMessage(result.error || 'Failed to update profile');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('An error occurred while updating profile');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setEditData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setEditData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    } catch (error) {
      return 'N/A';
    }
  };

  // Show loading state if user data is not yet loaded
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

    return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{user?.name}</h1>
                <p className="text-gray-600 mb-1">{user?.email}</p>
                <p className="text-gray-500 text-sm">Member since {formatDate(user?.createdAt)}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user?.role === 'admin' ? 'bg-red-100 text-red-800' :
                    user?.role === 'author' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user?.role?.charAt(0)?.toUpperCase() + user?.role?.slice(1) || 'User'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
            <button
              onClick={isEditing ? handleSave : handleEdit}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-200"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : isEditing ? (
                <>
                  <Save size={16} />
                  <span>Save</span>
                </>
              ) : (
                <>
                  <Edit3 size={16} />
                  <span>Edit Profile</span>
                </>
              )}
            </button>
              {user?.role === 'author' && (
                <button
                  onClick={() => navigate('/create')}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <Plus size={16} />
                  <span>Create Post</span>
                </button>
              )}
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-lg mb-4 flex items-center space-x-2 ${
              messageType === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {messageType === 'success' ? (
                <CheckCircle size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
              <span>{message}</span>
            </div>
          )}

          {/* Profile Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User size={20} className="text-gray-400" />
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your name"
                    />
                  ) : (
                    <span className="text-gray-900">{user?.name || 'Not specified'}</span>
                  )}
            </div>
          </div>

              <div className="flex items-center space-x-3">
                <Mail size={20} className="text-gray-400" />
                <span className="text-gray-900">{user?.email}</span>
                </div>

              <div className="flex items-center space-x-3">
                <Building size={20} className="text-gray-400" />
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      placeholder="Company"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <span className="text-gray-900">{user?.company || 'Not specified'}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <User size={20} className="text-gray-400" />
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      placeholder="Position"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <span className="text-gray-900">{user?.position || 'Not specified'}</span>
                  )}
              </div>
            </div>
          </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Globe size={20} className="text-gray-400" />
                <div className="flex-1">
                  {isEditing ? (
                  <input
                      type="url"
                      value={editData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="Website"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <span className="text-gray-900">{user?.website || 'Not specified'}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Linkedin size={20} className="text-gray-400" />
                <div className="flex-1">
                  {isEditing ? (
                <input
                      type="url"
                      value={editData.socialLinks.linkedin}
                      onChange={(e) => handleInputChange('socialLinks.linkedin', e.target.value)}
                      placeholder="LinkedIn"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <span className="text-gray-900">{user?.socialLinks?.linkedin || 'Not specified'}</span>
                  )}
              </div>
            </div>

              <div className="flex items-center space-x-3">
                <Twitter size={20} className="text-gray-400" />
                <div className="flex-1">
                  {isEditing ? (
                <input
                      type="url"
                      value={editData.socialLinks.twitter}
                      onChange={(e) => handleInputChange('socialLinks.twitter', e.target.value)}
                      placeholder="Twitter"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <span className="text-gray-900">{user?.socialLinks?.twitter || 'Not specified'}</span>
                  )}
              </div>
            </div>

              <div className="flex items-center space-x-3">
                <Github size={20} className="text-gray-400" />
                <div className="flex-1">
                  {isEditing ? (
                  <input
                      type="url"
                      value={editData.socialLinks.github}
                      onChange={(e) => handleInputChange('socialLinks.github', e.target.value)}
                      placeholder="GitHub"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <span className="text-gray-900">{user?.socialLinks?.github || 'Not specified'}</span>
                  )}
                </div>
              </div>
                </div>
              </div>

          {/* Bio */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            {isEditing ? (
              <textarea
                value={editData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={3}
                placeholder="Tell us about yourself..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{user?.bio || 'No bio provided'}</p>
            )}
          </div>

          {/* Cancel Button */}
          {isEditing && (
            <div className="mt-6">
            <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
                Cancel
            </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
