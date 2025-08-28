import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, Heart, Calendar, User, Tag, Briefcase } from 'lucide-react';

const CaseStudyDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [caseStudy, setCaseStudy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCaseStudy = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/case-studies/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setCaseStudy(data);
        } else {
          setError('Case study not found');
        }
      } catch (err) {
        setError('Failed to load case study');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCaseStudy();
    }
  }, [slug]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryLabel = (category) => {
    const categories = {
      'web-apps': 'Web Applications',
      'mobile-apps': 'Mobile Applications',
      'windows-apps': 'Windows Applications',
      'digital-marketing': 'Digital Marketing',
      'ad-shoot': 'Ad Shoot'
    };
    return categories[category] || category;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !caseStudy) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Case Study Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The case study you are looking for does not exist.'}</p>
            <button
              onClick={() => navigate('/case-studies')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Back to Case Studies
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/case-studies')}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors duration-200"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Case Studies
        </button>

        {/* Case Study Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex items-center mb-4">
            <Briefcase size={24} className="text-blue-600 mr-3" />
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
              {getCategoryLabel(caseStudy.category)}
            </span>
            {caseStudy.featured && (
              <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                Featured
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {caseStudy.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-6 leading-relaxed">
            {caseStudy.description}
          </p>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-t border-gray-200 pt-6">
            <div className="flex items-center">
              <User size={16} className="mr-2" />
              <span className="font-medium">{caseStudy.authorName}</span>
            </div>
            
            <div className="flex items-center">
              <Calendar size={16} className="mr-2" />
              <span>{formatDate(caseStudy.createdAt)}</span>
            </div>
            
            <div className="flex items-center">
              <Eye size={16} className="mr-2" />
              <span>{(caseStudy.views || 0).toLocaleString()} views</span>
            </div>
            
            <div className="flex items-center">
              <Heart size={16} className="mr-2" />
              <span>{(caseStudy.likes || 0).toLocaleString()} likes</span>
            </div>
          </div>

          {/* Tags */}
          {caseStudy.tags && caseStudy.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {caseStudy.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                >
                  <Tag size={14} className="mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Case Study Image */}
        {caseStudy.image && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
            <img
              src={caseStudy.image}
              alt={caseStudy.title}
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}

        {/* Case Study Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Case Study Details</h2>
          <div className="prose prose-lg max-w-none">
            <div 
              className="text-gray-700 leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: (caseStudy.content || '').replace(/\n/g, '<br>') }}
            />
          </div>
        </div>

        {/* Author Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mt-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">About the Author</h3>
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 font-semibold text-2xl flex items-center justify-center mr-4">
              {(caseStudy.authorName || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900">{caseStudy.authorName}</h4>
              <p className="text-gray-600">Author & Developer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyDetail;
