import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Building, Globe, Linkedin, Twitter, Github, Edit3, Save, X, BookOpen, Heart, Bookmark, Eye } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Mock data - replace with actual API calls
  const readingHistory = [
    {
      id: 1,
      title: "Netflix: Revolutionizing Content Distribution",
      type: "case-study",
      readAt: "2024-01-15",
      progress: 100
    },
    {
      id: 2,
      title: "How to Build a Successful Startup",
      type: "blog",
      readAt: "2024-01-10",
      progress: 75
    }
  ];

  const likedPosts = [
    {
      id: 1,
      title: "Tesla Marketing Strategy",
      type: "case-study",
      likedAt: "2024-01-12"
    }
  ];

  const bookmarks = [
    {
      id: 1,
      title: "Airbnb Growth Case Study",
      type: "case-study",
      bookmarkedAt: "2024-01-08"
    }
  ];

  const handleEdit = () => {
    setIsEditing(true);
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

  const handleCancel = () => {
    setIsEditing(false);
    setMessage('');
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');

    try {
      const result = await updateProfile(editData);
      if (result.success) {
        setMessage('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setMessage(''), 3000);
    } else {
        setMessage(result.error || 'Failed to update profile');
      }
    } catch (error) {
      setMessage('An error occurred while updating profile');
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTypeColor = (type) => {
    return type === 'case-study' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
  };

  const getTypeLabel = (type) => {
    return type === 'case-study' ? 'Case Study' : 'Blog';
  };

    return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <p className="text-gray-500 text-sm">Member since {formatDate(user?.createdAt || new Date())}</p>
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
          </div>

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-lg mb-4 ${
              message.includes('successfully') 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message}
            </div>
          )}

          {/* Profile Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User size={20} className="text-gray-400" />
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <span className="text-gray-900">{user?.name}</span>
                  )}
            </div>
          </div>

              <div className="flex items-center space-x-3">
                <Mail size={20} className="text-gray-400" />
                <span className="text-gray-900">{user?.email}</span>
                </div>

              <div className="flex items-center space-x-3">
                <Building size={20} className="text-gray-400" />
                <div>
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
                <div>
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
              <div>
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
            <div>
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
            <div>
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
              <div>
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen size={24} className="text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{user?.stats?.articlesRead || 0}</div>
            <div className="text-gray-600">Articles Read</div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye size={24} className="text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{user?.stats?.caseStudiesRead || 0}</div>
            <div className="text-gray-600">Case Studies Read</div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={24} className="text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{user?.stats?.bookmarks || 0}</div>
            <div className="text-gray-600">Bookmarks</div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bookmark size={24} className="text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{user?.stats?.bookmarks || 0}</div>
            <div className="text-gray-600">Total Bookmarks</div>
          </div>
          </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reading History */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <BookOpen size={20} className="mr-2" />
              Reading History
            </h3>
            <div className="space-y-3">
              {readingHistory.map((item) => (
                <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                      {getTypeLabel(item.type)}
                    </span>
                    <span className="text-xs text-gray-500">{formatDate(item.readAt)}</span>
                  </div>
                  <h4 className="font-medium text-gray-900 text-sm mb-1">{item.title}</h4>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 mt-1 block">{item.progress}% complete</span>
              </div>
              ))}
              </div>
            </div>

          {/* Liked Posts */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Heart size={20} className="mr-2" />
              Liked Posts
            </h3>
            <div className="space-y-3">
              {likedPosts.map((item) => (
                <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                      {getTypeLabel(item.type)}
                    </span>
                    <span className="text-xs text-gray-500">{formatDate(item.likedAt)}</span>
                  </div>
                  <h4 className="font-medium text-gray-900 text-sm">{item.title}</h4>
                </div>
              ))}
            </div>
          </div>

          {/* Bookmarks */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Bookmark size={20} className="mr-2" />
              Bookmarks
            </h3>
            <div className="space-y-3">
              {bookmarks.map((item) => (
                <div key={item.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                      {getTypeLabel(item.type)}
                    </span>
                    <span className="text-xs text-gray-500">{formatDate(item.bookmarkedAt)}</span>
                  </div>
                  <h4 className="font-medium text-gray-900 text-sm">{item.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
