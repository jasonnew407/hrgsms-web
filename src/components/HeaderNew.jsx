import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, ChevronDown, User, LayoutDashboard, LogOut } from 'lucide-react';
import morenaLogo from '../assets/new_logo.png';

const HeaderNew = ({ 
  isMobileSidebarOpen, 
  setIsMobileSidebarOpen, 
  isUserMenuOpen, 
  setIsUserMenuOpen, 
  handleLogout 
}) => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen, setIsUserMenuOpen]);

  const handleDashboardClick = () => {
    navigate('/adminDashboard');
  };

  const handleMyProfileClick = () => {
    setIsUserMenuOpen(false);
    navigate('/profile-edit');
  };

  const handleDashboardMenuClick = () => {
    setIsUserMenuOpen(false);
    navigate('/adminDashboard');
  };

  const handleLogoutClick = () => {
    setIsUserMenuOpen(false);
    handleLogout();
    navigate('/management-portal-login');
  };

  return (
    <header className="flex items-center justify-between h-16 px-4 sm:px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-20 flex-shrink-0">
      {/* Left Side - Mobile Menu + Logo */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="lg:hidden text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Clickable Logo and Title */}
        <button
          onClick={handleDashboardClick}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <img 
            src={morenaLogo}
            alt="Morena Hotels Logo" 
            className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
          />
          <h2 className="text-xl font-bold tracking-tight font-display text-[#003366] dark:text-white">
            Morena Hotels
          </h2>
        </button>
      </div>

      {/* Right Side - User Menu */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className="flex items-center gap-2 sm:gap-3 focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors"
        >
          <img
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCut0S2bkyePaAUSPX7TplRjTEIPqyfWiW_BAxTHM0r0KmbrYokBq8zXGwoQsDfPzYi-NKZQRVwCjAcPFvNm2MhXXT28Eat4jagsB9gvDF1Jyi8OROjwpVKCTtP97JYimL6ElaWDAOwaXNXaEdL4ybtz4Ry-DzLtPjQUa4rtg4de6SZXoTVV4ng7tAezUvFx5VSALA4KpwM_m5gt8-uWK9RPjTpUa4mICT163rZy7WGB1T_C-iFOoBuEQjL5rL8RhNQZc7B7qQrfw"
            alt="User profile"
          />
          <div className="text-left hidden md:block">
            <div className="font-medium text-gray-800 dark:text-white text-sm">John Doe</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Downtown Branch</div>
          </div>
          <ChevronDown 
            className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform hidden sm:block ${
              isUserMenuOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isUserMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
            <button
              onClick={handleMyProfileClick}
              className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <User className="w-4 h-4" />
              <span>My Profile</span>
            </button>
            <button
              onClick={handleDashboardMenuClick}
              className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>
            <button
              onClick={handleLogoutClick}
              className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderNew;
