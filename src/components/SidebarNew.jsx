import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  Building2, 
  ScrollText, 
  LogOut, 
  Menu 
} from 'lucide-react';
import morenaLogo from '../assets/morena_logo_s.png';

const Sidebar = ({ 
  isSidebarExpanded, 
  toggleSidebar, 
  isMobileSidebarOpen, 
  setIsMobileSidebarOpen, 
  handleLogout 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/adminDashboard'
    },
    { 
      icon: Users, 
      label: 'User Management', 
      path: '/user-management'
    },
    { 
      icon: ShieldCheck, 
      label: 'Role Management', 
      path: '/role-manage'
    },
    { 
      icon: Building2, 
      label: 'Branch Management', 
      path: '/branch-manage'
    },
    { 
      icon: ScrollText, 
      label: 'View User Log', 
      path: '/user-log'
    },
  ];

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/management-portal-login');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden lg:flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex-shrink-0 ${
          isSidebarExpanded ? 'w-64' : 'w-20'
        }`}
      >
        {/* Sidebar Toggle Button */}
        <div className="flex items-center justify-end px-3 py-2 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={toggleSidebar}
            className="text-[#003366] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 rounded transition-colors"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto hide-scrollbar">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link 
                key={index}
                to={item.path}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-[#0d93f2]' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                } ${!isSidebarExpanded && 'justify-center'}`}
                title={!isSidebarExpanded ? item.label : ''}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {isSidebarExpanded && <span className="truncate text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogoutClick}
            className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 text-sm font-medium transition-colors ${
              !isSidebarExpanded && 'justify-center'
            }`}
            title={!isSidebarExpanded ? 'Logout' : ''}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {isSidebarExpanded && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside 
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-40 lg:hidden transform transition-transform duration-300 flex flex-col ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <img 
              src={morenaLogo}
              alt="Logo" 
              className="w-8 h-8"
            />
            <h2 className="text-lg font-bold font-display text-[#003366] dark:text-white">
              Morena Hotels
            </h2>
          </div>
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto hide-scrollbar">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link 
                key={index}
                to={item.path}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-[#0d93f2]' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => setIsMobileSidebarOpen(false)}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Logout Button */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => {
              handleLogoutClick();
              setIsMobileSidebarOpen(false);
            }}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 text-sm font-medium transition-colors"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
