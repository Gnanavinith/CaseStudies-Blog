import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Search, ArrowRight, Star, Clock, User } from 'lucide-react';

const AdShoot = () => {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    const fetchCaseStudies = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/case-studies?category=ad-shoot&page=1&limit=12');
        const data = await res.json();
        if (res.ok) {
          setCaseStudies(data.caseStudies || []);
        } else {
          setCaseStudies([]);
        }
      } catch (e) {
        setCaseStudies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseStudies();
  }, []);

  const filteredCaseStudies = caseStudies.filter(study => {
    const matchesSearch = study.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         study.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Camera size={48} className="mr-3" />
              <h1 className="text-4xl font-bold">Ad Shoot</h1>
            </div>
            <p className="text-xl text-pink-100 max-w-3xl mx-auto mb-8">
              Discover the art and science behind successful advertising campaigns. 
              Learn how brands create compelling visual stories that resonate with audiences.
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm">
              <span className="flex items-center">
                <Clock size={16} className="mr-1" />
                {caseStudies.length} Case Studies
              </span>
              <span className="flex items-center">
                <Star size={16} className="mr-1" />
                Average Rating: 4.8
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search ad shoot case studies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>


          </div>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCaseStudies.map((study) => (
            <article key={study._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
              {/* Image */}
              {study.image && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={study.image}
                    alt={study.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-pink-600 font-medium">Ad Shoot</span>
                  <span className="text-sm text-gray-500">{formatDate(study.createdAt)}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-pink-600 transition-colors duration-200">
                  {study.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {study.description}
                </p>

                {/* Tags */}
                {study.tags && study.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {study.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Author and Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-700 font-semibold flex items-center justify-center">
                      {(study.authorName || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{study.authorName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <span>{(study.views || 0).toLocaleString()} views</span>
                      <span>{(study.likes || 0).toLocaleString()} likes</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  to={`/case-studies/${study.slug}`}
                  className="w-full bg-pink-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-pink-700 transition-colors duration-200 flex items-center justify-center group"
                >
                  View Case Study
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {filteredCaseStudies.length === 0 && (
          <div className="text-center py-16">
            <Camera size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No case studies found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('all');
              }}
              className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdShoot;
