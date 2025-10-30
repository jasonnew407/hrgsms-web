import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Filter, 
  X, 
  Edit, 
  Key, 
  ShieldAlert, 
  LockKeyhole, 
  ChevronLeft, 
  ChevronRight, 
  UserPlus, 
  UserX, 
  Lock, 
  LockOpen, 
  LogOut, 
  User, 
  Mail, 
  Globe, 
  Monitor, 
  FileText, 
  Database 
} from 'lucide-react';
import axios from 'axios';
import HeaderNew from '../components/HeaderNew';
import Sidebar from '../components/SidebarNew';

// Activity Details Modal Component
const ActivityDetailsModal = ({ isOpen, onClose, activity }) => {
  if (!isOpen || !activity) return null;

  const formatDetailedTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatMetadata = (metadata) => {
    if (!metadata) return null;
    
    try {
      const parsed = typeof metadata === 'string' ? JSON.parse(metadata) : metadata;
      return JSON.stringify(parsed, null, 2);
    } catch {
      return String(metadata);
    }
  };

  const getActivityIcon = (type) => {
    const iconMap = {
      'login_success': { icon: Key, bg: 'bg-green-100 dark:bg-green-900/30', color: 'text-green-600 dark:text-green-400' },
      'login_fail': { icon: ShieldAlert, bg: 'bg-yellow-100 dark:bg-yellow-900/30', color: 'text-yellow-600 dark:text-yellow-400' },
      'logout': { icon: LogOut, bg: 'bg-gray-100 dark:bg-gray-700', color: 'text-gray-600 dark:text-gray-400' },
      'password_reset': { icon: LockKeyhole, bg: 'bg-blue-100 dark:bg-blue-900/30', color: 'text-blue-600 dark:text-blue-400' },
      'password_change': { icon: LockKeyhole, bg: 'bg-blue-100 dark:bg-blue-900/30', color: 'text-blue-600 dark:text-blue-400' },
      'user_created': { icon: UserPlus, bg: 'bg-green-100 dark:bg-green-900/30', color: 'text-green-600 dark:text-green-400' },
      'user_updated': { icon: Edit, bg: 'bg-blue-100 dark:bg-blue-900/30', color: 'text-blue-600 dark:text-blue-400' },
      'user_deleted': { icon: UserX, bg: 'bg-red-100 dark:bg-red-900/30', color: 'text-red-600 dark:text-red-400' },
      'user_blocked': { icon: Lock, bg: 'bg-red-100 dark:bg-red-900/30', color: 'text-red-600 dark:text-red-400' },
      'user_unblocked': { icon: LockOpen, bg: 'bg-green-100 dark:bg-green-900/30', color: 'text-green-600 dark:text-green-400' },
      'account_locked': { icon: Lock, bg: 'bg-red-100 dark:bg-red-900/30', color: 'text-red-600 dark:text-red-400' },
      'account_unlocked': { icon: LockOpen, bg: 'bg-green-100 dark:bg-green-900/30', color: 'text-green-600 dark:text-green-400' },
      'reservation_created': { icon: Edit, bg: 'bg-blue-100 dark:bg-blue-900/30', color: 'text-blue-600 dark:text-blue-400' },
      'reservation_updated': { icon: Edit, bg: 'bg-blue-100 dark:bg-blue-900/30', color: 'text-blue-600 dark:text-blue-400' },
      'reservation_cancelled': { icon: X, bg: 'bg-red-100 dark:bg-red-900/30', color: 'text-red-600 dark:text-red-400' },
      'guest_checkin': { icon: Key, bg: 'bg-green-100 dark:bg-green-900/30', color: 'text-green-600 dark:text-green-400' },
      'guest_checkout': { icon: LogOut, bg: 'bg-blue-100 dark:bg-blue-900/30', color: 'text-blue-600 dark:text-blue-400' },
      'payment_processed': { icon: Edit, bg: 'bg-green-100 dark:bg-green-900/30', color: 'text-green-600 dark:text-green-400' },
      'refund_issued': { icon: X, bg: 'bg-yellow-100 dark:bg-yellow-900/30', color: 'text-yellow-600 dark:text-yellow-400' },
    };
    
    return iconMap[type] || { icon: Edit, bg: 'bg-gray-100 dark:bg-gray-700', color: 'text-gray-600 dark:text-gray-400' };
  };

  const iconConfig = getActivityIcon(activity.type);
  const IconComponent = iconConfig.icon;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden pointer-events-auto animate-in fade-in zoom-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex-1 min-w-0 pr-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                Activity Details
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Complete information about this activity
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              aria-label="Close modal"
            >
              <X className="w-6 h-6 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-140px)] hide-scrollbar">
            <div className="space-y-6">
              {/* Activity Title & Type */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full ${iconConfig.bg} ${iconConfig.color} shrink-0`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg">
                      {activity.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      Type: <span className="font-medium">{activity.type}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {activity.description && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Description
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {activity.description}
                    </p>
                  </div>
                </div>
              )}

              {/* User Information */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide flex items-center gap-2">
                  <User className="w-4 h-4" />
                  User Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <User className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 dark:text-gray-400">User Name</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {activity.userName || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {activity.userEmail || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Database className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 dark:text-gray-400">User ID</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.userId || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Timestamp</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white break-words">
                        {formatDetailedTimestamp(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Details */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Technical Details
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 dark:text-gray-400">IP Address</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white font-mono">
                        {activity.ipAddress || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {activity.userAgent && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <Monitor className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 dark:text-gray-400">User Agent</p>
                        <p className="text-xs font-medium text-gray-900 dark:text-white break-all">
                          {activity.userAgent}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Metadata */}
              {activity.metadata && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Additional Metadata
                  </h4>
                  <div className="p-4 bg-gray-900 dark:bg-gray-950 rounded-lg overflow-x-auto">
                    <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap break-words">
                      {formatMetadata(activity.metadata)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoom-in {
          from { transform: scale(0.95); }
          to { transform: scale(1); }
        }
        .animate-in {
          animation: fade-in 0.2s ease-out, zoom-in 0.2s ease-out;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};

// Main User Activity Log Component
const UserActivityLog = () => {
  // Sidebar & UI State
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Activity Log State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [eventType, setEventType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activityLogs, setActivityLogs] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  // Fetch activity types on mount
  useEffect(() => {
    fetchActivityTypes();
    fetchActivityLogs();
  }, []);

  // Fetch logs when page changes
  useEffect(() => {
    if (currentPage > 1) {
      fetchActivityLogs();
    }
  }, [currentPage]);

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        handleCloseModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isModalOpen]);

  const fetchActivityTypes = async () => {
    try {
      const res = await axios.get('/api/activity-logs/types');
      if (res.status >= 200 && res.status < 300) {
        setActivityTypes(res.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching activity types:', error.response?.data || error.message || error);
    }
  };

  const fetchActivityLogs = async () => {
    setLoading(true);
    setErrorMessage('');
    
    try {
      const params = new URLSearchParams();
      params.append('page', currentPage);
      params.append('limit', 10);
      
      if (searchQuery && searchQuery.trim()) params.append('search', searchQuery.trim());
      if (eventType && eventType !== 'all') params.append('activityType', eventType);
      if (startDate && startDate.trim()) params.append('startDate', startDate);
      if (endDate && endDate.trim()) params.append('endDate', endDate);

      const res = await axios.get(`/api/activity-logs?${params.toString()}`);
      
      if (res.status >= 200 && res.status < 300) {
        setActivityLogs(res.data.data || []);
        setPagination(res.data.pagination || {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        });
      }
    } catch (error) {
      console.error('Error fetching activity logs:', error.response?.data || error.message || error);
      setErrorMessage('Failed to fetch activity logs. Please try again.');
      setActivityLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setEventType('all');
    setSearchQuery('');
    setCurrentPage(1);
    setTimeout(() => {
      fetchActivityLogs();
    }, 100);
  };

  const handleApplyFilters = () => {
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      setErrorMessage('Start date cannot be after end date');
      return;
    }
    
    setCurrentPage(1);
    fetchActivityLogs();
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleApplyFilters();
    }
  };

  const handleViewDetails = async (log) => {
    try {
      const res = await axios.get(`/api/activity-logs/${log.id}`);
      
      if (res.status >= 200 && res.status < 300 && res.data) {
        const responseData = res.data.data || res.data;
        
        const activityData = {
          id: responseData.id,
          userId: responseData.userId,
          userName: responseData.userName,
          userEmail: responseData.userEmail,
          type: responseData.type,
          title: responseData.title,
          description: responseData.description,
          ipAddress: responseData.ipAddress,
          userAgent: responseData.userAgent,
          metadata: responseData.metadata,
          timestamp: responseData.timestamp
        };
        
        setSelectedActivity(activityData);
        setTimeout(() => setIsModalOpen(true), 0);
      }
    } catch (error) {
      console.error('Error fetching activity details:', error);
      
      const activityData = {
        id: log.id,
        userId: log.userId,
        userName: log.userName,
        userEmail: log.userEmail,
        type: log.type,
        title: log.title,
        description: log.description,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        metadata: log.metadata,
        timestamp: log.timestamp
      };
      
      setSelectedActivity(activityData);
      setTimeout(() => setIsModalOpen(true), 0);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedActivity(null);
  };

  const getActivityIcon = (type) => {
    const iconMap = {
      'login_success': { icon: Key, bg: 'bg-green-100 dark:bg-green-900/30', color: 'text-green-600 dark:text-green-400' },
      'login_fail': { icon: ShieldAlert, bg: 'bg-yellow-100 dark:bg-yellow-900/30', color: 'text-yellow-600 dark:text-yellow-400' },
      'logout': { icon: LogOut, bg: 'bg-gray-100 dark:bg-gray-700', color: 'text-gray-600 dark:text-gray-400' },
      'password_reset': { icon: LockKeyhole, bg: 'bg-blue-100 dark:bg-blue-900/30', color: 'text-blue-600 dark:text-blue-400' },
      'password_change': { icon: LockKeyhole, bg: 'bg-blue-100 dark:bg-blue-900/30', color: 'text-blue-600 dark:text-blue-400' },
      'user_created': { icon: UserPlus, bg: 'bg-green-100 dark:bg-green-900/30', color: 'text-green-600 dark:text-green-400' },
      'user_updated': { icon: Edit, bg: 'bg-blue-100 dark:bg-blue-900/30', color: 'text-blue-600 dark:text-blue-400' },
      'user_deleted': { icon: UserX, bg: 'bg-red-100 dark:bg-red-900/30', color: 'text-red-600 dark:text-red-400' },
      'user_blocked': { icon: Lock, bg: 'bg-red-100 dark:bg-red-900/30', color: 'text-red-600 dark:text-red-400' },
      'user_unblocked': { icon: LockOpen, bg: 'bg-green-100 dark:bg-green-900/30', color: 'text-green-600 dark:text-green-400' },
      'account_locked': { icon: Lock, bg: 'bg-red-100 dark:bg-red-900/30', color: 'text-red-600 dark:text-red-400' },
      'account_unlocked': { icon: LockOpen, bg: 'bg-green-100 dark:bg-green-900/30', color: 'text-green-600 dark:text-green-400' },
      'reservation_created': { icon: Edit, bg: 'bg-blue-100 dark:bg-blue-900/30', color: 'text-blue-600 dark:text-blue-400' },
      'reservation_updated': { icon: Edit, bg: 'bg-blue-100 dark:bg-blue-900/30', color: 'text-blue-600 dark:text-blue-400' },
      'reservation_cancelled': { icon: X, bg: 'bg-red-100 dark:bg-red-900/30', color: 'text-red-600 dark:text-red-400' },
      'guest_checkin': { icon: Key, bg: 'bg-green-100 dark:bg-green-900/30', color: 'text-green-600 dark:text-green-400' },
      'guest_checkout': { icon: LogOut, bg: 'bg-blue-100 dark:bg-blue-900/30', color: 'text-blue-600 dark:text-blue-400' },
      'payment_processed': { icon: Edit, bg: 'bg-green-100 dark:bg-green-900/30', color: 'text-green-600 dark:text-green-400' },
      'refund_issued': { icon: X, bg: 'bg-yellow-100 dark:bg-yellow-900/30', color: 'text-yellow-600 dark:text-yellow-400' },
    };
    
    return iconMap[type] || { icon: Edit, bg: 'bg-gray-100 dark:bg-gray-700', color: 'text-gray-600 dark:text-gray-400' };
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="flex flex-col h-screen bg-[#f5f7f8] dark:bg-[#0f1923] overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Manrope:wght@200;300;400;500;600;700;800&display=swap');
        body {
          font-family: 'Manrope', sans-serif;
        }
        .font-display { 
          font-family: 'Playfair Display', serif; 
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Header Component */}
      <HeaderNew 
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        isUserMenuOpen={isUserMenuOpen}
        setIsUserMenuOpen={setIsUserMenuOpen}
        handleLogout={handleLogout}
      />

      {/* Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Component */}
        <Sidebar 
          isSidebarExpanded={isSidebarExpanded}
          toggleSidebar={toggleSidebar}
          isMobileSidebarOpen={isMobileSidebarOpen}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
          handleLogout={handleLogout}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 bg-[#f5f7f8] dark:bg-[#0f1923] overflow-y-auto hide-scrollbar">
          <div className="w-full max-w-6xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-black leading-tight tracking-[-0.033em] text-[#111518] dark:text-white mb-4">
              User Activity Log
            </h1>

            {/* Filters Section */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 p-3 bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
              <div className="flex flex-col sm:flex-row flex-wrap gap-2 items-stretch sm:items-center flex-1">
                {/* Search */}
                <div className="relative flex-1 min-w-[160px]">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    placeholder="Search activities..."
                    className="w-full h-9 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent text-gray-800 dark:text-gray-200 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#389cfa]/50"
                  />
                </div>

                {/* Start Date */}
                <div className="relative flex-1 min-w-[140px]">
                  <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    max={endDate || undefined}
                    className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#389cfa]/50"
                  />
                </div>

                {/* End Date */}
                <div className="relative flex-1 min-w-[140px]">
                  <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || undefined}
                    className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#389cfa]/50"
                  />
                </div>

                {/* Event Type Filter */}
                <div className="relative flex-1 min-w-[160px]">
                  <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full h-9 pl-9 pr-8 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#389cfa]/50 appearance-none cursor-pointer bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2fsvg%22%20viewBox%3d%220%200%2020%2020%22%20fill%3d%22none%22%3e%3cpath%20stroke%3d%22%236b7280%22%20stroke-linecap%3d%22round%22%20stroke-linejoin%3d%22round%22%20stroke-width%3d%221.5%22%20d%3d%22M6%208l4%204%204-4%22%2f%3e%3c%2fsvg%3e')] bg-[length:1.2em] bg-[right_0.5rem_center] bg-no-repeat"
                  >
                    <option value="all">All Event Types</option>
                    {activityTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="flex-1 sm:flex-none h-9 px-3 rounded-lg text-[#389cfa] dark:text-blue-400 text-sm font-semibold hover:bg-[#389cfa]/10 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={handleApplyFilters}
                  disabled={loading}
                  className="flex-1 sm:flex-none h-9 px-4 rounded-lg bg-[#389cfa] text-white text-sm font-semibold hover:bg-[#389cfa]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Apply'}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                <p className="text-red-600 dark:text-red-400 text-xs">{errorMessage}</p>
              </div>
            )}

            {/* Activity Log Items */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#389cfa]"></div>
              </div>
            ) : (
              <div className="space-y-3">
                {activityLogs.length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400">No activity logs found</p>
                  </div>
                ) : (
                  activityLogs.map((log) => {
                    const iconConfig = getActivityIcon(log.type);
                    const IconComponent = iconConfig.icon;
                    
                    return (
                      <div
                        key={log.id}
                        className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-[#389cfa]/50 dark:hover:border-[#389cfa]/50 transition-colors"
                      >
                        <div className={`flex items-center justify-center w-9 h-9 rounded-full ${iconConfig.bg} ${iconConfig.color} shrink-0`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-gray-900 dark:text-white mb-0.5">
                            {log.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {log.userName || 'System'} • {formatTimestamp(log.timestamp)} • IP: {log.ipAddress || 'N/A'}
                          </p>
                          {log.userEmail && (
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                              {log.userEmail}
                            </p>
                          )}
                          {log.description && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {log.description}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleViewDetails(log)}
                          className="text-xs font-semibold text-[#389cfa] hover:underline whitespace-nowrap shrink-0"
                        >
                          View Details
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Pagination */}
            {!loading && activityLogs.length > 0 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Previous
                </button>

                {/* Page Numbers - Hidden on mobile */}
                <div className="hidden sm:flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                  {[...Array(Math.min(5, pagination.totalPages))].map((_, idx) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = idx + 1;
                    } else if (currentPage <= 3) {
                      pageNum = idx + 1;
                    } else if (currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + idx;
                    } else {
                      pageNum = currentPage - 2 + idx;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`flex items-center justify-center w-8 h-8 rounded-lg font-medium transition-colors ${
                          currentPage === pageNum
                            ? 'bg-[#389cfa]/10 text-[#389cfa] font-bold'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  {pagination.totalPages > 5 && currentPage < pagination.totalPages - 2 && (
                    <>
                      <span className="px-1">...</span>
                      <button
                        onClick={() => setCurrentPage(pagination.totalPages)}
                        className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors"
                      >
                        {pagination.totalPages}
                      </button>
                    </>
                  )}
                </div>

                {/* Page indicator for mobile */}
                <div className="sm:hidden text-xs text-gray-600 dark:text-gray-400 font-medium">
                  Page {currentPage} of {pagination.totalPages}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center transition-colors"
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Activity Details Modal */}
      <ActivityDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        activity={selectedActivity}
      />
    </div>
  );
};

export default UserActivityLog;
