import React, { useState, useEffect } from 'react';
import { Menu, X, User, ChevronDown, ChevronUp, Home, FileText, Briefcase, LogOut, Settings, DollarSign, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';

const menuItems = [
  { name: "Web Apps", path: "/case-studies/web-apps" },
  { name: "Mobile Apps", path: "/case-studies/mobile-apps" },
  { name: "Windows Apps", path: "/case-studies/windows-apps" },
  { name: "Digital Marketing", path: "/case-studies/digital-marketing" },
  { name: "Ad Shoot", path: "/case-studies/ad-shoot" }
];

const Dropdown = ({ isOpen, items, onToggle, label, icon, onItemClick }) => (
  <div className="relative group">
    <button 
      onClick={onToggle} 
      className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-slate-50 transition-all duration-200 group-hover:text-blue-600 font-medium"
    >
      {icon && <span className="text-lg">{icon}</span>}
      <span>{label}</span>
      <span className="transition-transform duration-200">
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </span>
    </button>
    <div className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden transition-all duration-300 z-50 ${
      isOpen ? 'opacity-100 visible transform translate-y-0' : 'opacity-0 invisible transform -translate-y-2'
    } md:absolute`}>
      <div className="py-2">
        {items.map((item) => (
           <button 
             key={item.name || item} 
             onClick={() => onItemClick && onItemClick(item)}
             className="flex items-center w-full px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 border-l-4 border-transparent hover:border-blue-500 text-left"
           >
             <span className="font-medium">{item.name || item}</span>
           </button>
        ))}
      </div>
    </div>
  </div>
);

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCaseStudiesOpen, setIsCaseStudiesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { user, logout, isAuthenticated, canCreateContent } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full top-0 z-40 transition-all shadow-[-3px_6px_6px_0px_rgba(0,_0,_0,_0.1)] duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-lg border-b border-slate-200/50 shadow-lg' 
        : 'bg-white/80 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
         {/* Logo */}
<div className="flex items-center space-x-3">
  <button
    onClick={() => navigate('/')}
    className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent hover:opacity-80 transition cursor-pointer"
  >
    CaseBlog
  </button>
</div>


          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-2">
            
            
            <Dropdown
              label="Case Studies"
              icon={<Briefcase size={18} />}
              isOpen={isCaseStudiesOpen}
              onToggle={() => setIsCaseStudiesOpen(!isCaseStudiesOpen)}
              items={menuItems}
              onItemClick={(item) => {
                setIsCaseStudiesOpen(false);
                navigate(item.path);
              }}
            />
            
            <button 
               onClick={() => navigate('/blog')}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-slate-50 transition-all duration-200 font-medium text-slate-700 hover:text-blue-600"
            >
              <FileText size={18} />
              <span>Blog</span>
             </button>
             
                           <button 
                onClick={() => navigate('/pricing')}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-slate-50 transition-all duration-200 font-medium text-slate-700 hover:text-blue-600"
              >
                <DollarSign size={18} />
                <span>Pricing</span>
              </button>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:block mx-4">
            <SearchBar 
              onSearch={(query) => {
                console.log('Search query:', query);
                // TODO: Implement search functionality
              }}
            />
          </div>

          {/* Desktop Profile Section */}
          <div className="hidden lg:flex items-center space-x-2">
            <div className="w-px h-6 bg-slate-300 mx-2"></div>

            {isAuthenticated ? (
              <div className="relative group">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)} 
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-slate-50 transition-all duration-200 group-hover:text-blue-600 font-medium"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden md:block">{user?.name || 'User'}</span>
                  <ChevronDown size={16} />
                </button>
                <div className={`absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden transition-all duration-300 z-50 ${
                  isProfileOpen ? 'opacity-100 visible transform translate-y-0' : 'opacity-0 invisible transform -translate-y-2'
                }`}>
                  <div className="py-2">
                    <button 
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate('/profile');
                      }}
                      className="flex items-center w-full text-left px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                    >
                      <Settings size={16} className="mr-3" />
                      <span>Profile</span>
                    </button>
                    <button 
                      onClick={logout}
                      className="flex items-center w-full px-4 py-3 text-slate-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                    >
                      <LogOut size={16} className="mr-3" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => navigate('/signin')}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-slate-50 transition-all duration-200 font-medium text-slate-700 hover:text-blue-600"
                >
                  <User size={18} />
                  <span>Sign In</span>
                </button>
                <button 
                  onClick={() => navigate('/signup')}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 font-medium"
                >
                  <User size={18} />
                  <span>Sign Up</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
            >
              {isMenuOpen ? <X size={24} className="text-slate-700" /> : <Menu size={24} className="text-slate-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
        isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-white/95 backdrop-blur-lg border-t border-slate-200/50 px-4 py-6 space-y-2">
          <button 
            onClick={() => {
              setIsMenuOpen(false);
              navigate('/');
            }}
            className="flex items-center w-full text-left space-x-3 px-4 py-3 rounded-lg hover:bg-slate-50 transition-all duration-200 font-medium text-slate-700"
          >
            <Home size={20} />
            <span>Home</span>
          </button>
          
          <div className="space-y-2">
            <button 
              onClick={() => setIsCaseStudiesOpen(!isCaseStudiesOpen)}
              className="flex items-center justify-between w-full px-4 py-3 rounded-lg hover:bg-slate-50 transition-all duration-200 font-medium text-slate-700"
            >
              <div className="flex items-center space-x-3">
                <Briefcase size={20} />
                <span>Case Studies</span>
              </div>
              {isCaseStudiesOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            
            {isCaseStudiesOpen && (
              <div className="ml-6 space-y-1 border-l-2 border-slate-200 pl-4">
                {menuItems.map((item) => (
                  <button 
                    key={item.name} 
                    onClick={() => {
                      setIsCaseStudiesOpen(false);
                      setIsMenuOpen(false);
                      navigate(item.path);
                    }}
                    className="block w-full text-left px-4 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button 
            onClick={() => {
              setIsMenuOpen(false);
              navigate('/blog');
            }}
            className="flex items-center w-full text-left space-x-3 px-4 py-3 rounded-lg hover:bg-slate-50 transition-all duration-200 font-medium text-slate-700"
          >
            <FileText size={20} />
            <span>Blog</span>
           </button>
           
                       <button 
              onClick={() => {
                setIsMenuOpen(false);
                navigate('/pricing');
              }}
              className="flex items-center w-full text-left space-x-3 px-4 py-3 rounded-lg hover:bg-slate-50 transition-all duration-200 font-medium text-slate-700"
            >
              <DollarSign size={20} />
              <span>Pricing</span>
            </button>

          <div className="border-t border-slate-200 pt-4 mt-4">
            {isAuthenticated ? (
              <div className="space-y-2">
            <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/profile');
                  }}
                  className="flex items-center w-full text-left space-x-3 px-4 py-3 rounded-lg hover:bg-slate-50 transition-all duration-200 font-medium text-slate-700"
                >
                <User size={20} />
                  <span>Profile</span>
                </button>
                {canCreateContent() && (
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate('/create');
                    }}
                    className="flex items-center w-full text-left space-x-3 px-4 py-3 rounded-lg hover:bg-green-50 hover:text-green-600 transition-all duration-200 font-medium text-slate-700"
                  >
                    <Plus size={20} />
                    <span>Create Post</span>
                  </button>
                )}
                <button 
                  onClick={logout}
                  className="flex items-center w-full px-4 py-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all duration-200 font-medium text-slate-700"
                >
                  <LogOut size={20} />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/signin');
                  }}
                  className="flex items-center w-full px-4 py-3 rounded-lg hover:bg-slate-50 transition-all duration-200 font-medium text-slate-700"
                >
                  <User size={20} />
                  <span>Sign In</span>
                </button>
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/signup');
                  }}
                  className="flex items-center w-full px-4 py-3 rounded-lg hover:bg-slate-50 transition-all duration-200 font-medium text-slate-700"
                >
                  <User size={20} />
                  <span>Sign Up</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
    </nav>
  );
};

export default Navbar;   

