import React, { useState, useEffect } from 'react';
import { Monitor, Search, ArrowRight, Star, Clock, User } from 'lucide-react';

const WindowsApps = () => {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchCaseStudies = async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = [
        {
          id: 1,
          title: "Microsoft Office: Productivity Suite Evolution",
          company: "Microsoft",
          excerpt: "How Microsoft Office became the standard for business productivity software",
          category: "Windows Apps",
          industry: "Software",
          readTime: 10,
          rating: 4.9,
          views: 16800,
          author: "Rachel Green",
          authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
          featuredImage: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop",
          publishedAt: "2024-01-20",
          difficulty: "Advanced"
        },
        {
          id: 2,
          title: "Adobe Creative Suite: Design Software Revolution",
          company: "Adobe",
          excerpt: "The transformation of Adobe from a print company to a digital creative powerhouse",
          category: "Windows Apps",
          industry: "Design",
          readTime: 8,
          rating: 4.7,
          views: 14200,
          author: "Tom Wilson",
          authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
          featuredImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
          publishedAt: "2024-01-15",
          difficulty: "Intermediate"
        },
        {
          id: 3,
          title: "Visual Studio: Developer Tool Success",
          company: "Microsoft",
          excerpt: "How Visual Studio became the preferred IDE for Windows developers",
          category: "Windows Apps",
          industry: "Technology",
          readTime: 7,
          rating: 4.8,
          views: 11800,
          author: "Sarah Chen",
          authorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
          featuredImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop",
          publishedAt: "2024-01-10",
          difficulty: "Intermediate"
        }
      ];
      
      setCaseStudies(mockData);
      setLoading(false);
    };

    fetchCaseStudies();
  }, []);

  const filteredCaseStudies = caseStudies.filter(study => {
    const matchesSearch = study.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         study.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         study.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || study.difficulty.toLowerCase() === selectedFilter;
    
    return matchesSearch && matchesFilter;
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
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Monitor size={48} className="mr-3" />
              <h1 className="text-4xl font-bold">Windows Applications</h1>
            </div>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
              Discover how Windows applications have shaped the software industry and continue to drive innovation. 
              Learn from successful desktop software companies and their strategies.
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
                  placeholder="Search Windows app case studies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter */}
            <div className="lg:w-48">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Difficulties</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCaseStudies.map((study) => (
            <article key={study.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={study.featuredImage}
                  alt={study.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-purple-600 text-white text-sm font-medium rounded-full">
                    {study.difficulty}
                  </span>
                </div>
                <div className="absolute top-4 right-4 flex items-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="ml-1 text-sm font-medium text-gray-700">{study.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-purple-600 font-medium">{study.industry}</span>
                  <span className="text-sm text-gray-500">{formatDate(study.publishedAt)}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-purple-600 transition-colors duration-200">
                  {study.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {study.excerpt}
                </p>

                {/* Author and Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={study.authorAvatar}
                      alt={study.author}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{study.author}</p>
                      <p className="text-xs text-gray-500">{study.company}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{study.readTime} min read</p>
                    <p className="text-xs text-gray-400">{study.views.toLocaleString()} views</p>
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center group">
                  Read Case Study
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {filteredCaseStudies.length === 0 && (
          <div className="text-center py-16">
            <Monitor size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No case studies found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('all');
              }}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WindowsApps;
