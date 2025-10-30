import React, { useState, useEffect } from 'react';
import { Plus, Search, ChevronLeft, ChevronRight, Edit2, Trash2, Loader2, CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import axios from 'axios';
import Header from '../components/HeaderNew';
import Sidebar from '../components/SidebarNew';

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800 dark:text-green-200';
      case 'error':
        return 'text-red-800 dark:text-red-200';
      case 'warning':
        return 'text-yellow-800 dark:text-yellow-200';
      default:
        return 'text-blue-800 dark:text-blue-200';
    }
  };

  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg border shadow-lg ${getBgColor()} animate-slideIn`}>
      {getIcon()}
      <p className={`flex-1 text-sm font-medium ${getTextColor()}`}>{message}</p>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Delete Confirmation Modal Component
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, branchName }) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-[#0f1923] rounded-xl shadow-2xl animate-slideIn">
          <div className="p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
              <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-center text-gray-900 dark:text-white mb-2">
              Delete Branch
            </h3>
            <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">{branchName}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Branch Modal Component
const BranchModal = ({ isOpen, onClose, onConfirm, title, initialData = null }) => {
  const [formData, setFormData] = useState({
    hotelName: '',
    branchLocation: '',
    address: '',
    phone: '',
    email: '',
    taxRate: '',
    checkInTime: '14:00',
    checkOutTime: '12:00'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        hotelName: initialData.hotel_name || '',
        branchLocation: initialData.branch_location || '',
        address: initialData.address || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        taxRate: initialData.tax_rate || '',
        checkInTime: initialData.standard_checkin_time?.substring(0, 5) || '14:00',
        checkOutTime: initialData.standard_checkout_time?.substring(0, 5) || '12:00'
      });
    } else {
      setFormData({
        hotelName: '',
        branchLocation: '',
        address: '',
        phone: '',
        email: '',
        taxRate: '',
        checkInTime: '14:00',
        checkOutTime: '12:00'
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(formData);
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-2xl my-8 bg-white dark:bg-[#0f1923] rounded-xl shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-5 py-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-bold text-[#111518] dark:text-white">{title}</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Fill in the details below</p>
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-5 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="flex flex-col">
                  <p className="text-sm font-medium text-[#111518] dark:text-gray-200 pb-1.5">
                    Branch Name <span className="text-red-500">*</span>
                  </p>
                  <input
                    type="text"
                    value={formData.hotelName}
                    onChange={(e) => handleChange('hotelName', e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111518] dark:text-gray-200 text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#389cfa]/50 focus:border-[#389cfa]"
                    placeholder="e.g., Morena Hotels Colombo"
                    required
                  />
                </label>
              </div>

              <div>
                <label className="flex flex-col">
                  <p className="text-sm font-medium text-[#111518] dark:text-gray-200 pb-1.5">
                    Location <span className="text-red-500">*</span>
                  </p>
                  <input
                    type="text"
                    value={formData.branchLocation}
                    onChange={(e) => handleChange('branchLocation', e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111518] dark:text-gray-200 text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#389cfa]/50 focus:border-[#389cfa]"
                    placeholder="e.g., Weligama, Midigama"
                    required
                  />
                </label>
              </div>

              <div>
                <label className="flex flex-col">
                  <p className="text-sm font-medium text-[#111518] dark:text-gray-200 pb-1.5">
                    Tax Rate (%) <span className="text-red-500">*</span>
                  </p>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.taxRate}
                    onChange={(e) => handleChange('taxRate', e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111518] dark:text-gray-200 text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#389cfa]/50 focus:border-[#389cfa]"
                    placeholder="e.g., 12.5"
                    required
                  />
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="flex flex-col">
                  <p className="text-sm font-medium text-[#111518] dark:text-gray-200 pb-1.5">
                    Address <span className="text-red-500">*</span>
                  </p>
                  <textarea
                    rows="2"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111518] dark:text-gray-200 text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#389cfa]/50 focus:border-[#389cfa] resize-none"
                    placeholder="Enter full address"
                    required
                  />
                </label>
              </div>

              <div>
                <label className="flex flex-col">
                  <p className="text-sm font-medium text-[#111518] dark:text-gray-200 pb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </p>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111518] dark:text-gray-200 text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#389cfa]/50 focus:border-[#389cfa]"
                    placeholder="e.g., +94 11 234 5678"
                    required
                  />
                </label>
              </div>

              <div>
                <label className="flex flex-col">
                  <p className="text-sm font-medium text-[#111518] dark:text-gray-200 pb-1.5">
                    Email <span className="text-red-500">*</span>
                  </p>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111518] dark:text-gray-200 text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#389cfa]/50 focus:border-[#389cfa]"
                    placeholder="e.g., weligama@morenahotels.com"
                    required
                  />
                </label>
              </div>

              <div>
                <label className="flex flex-col">
                  <p className="text-sm font-medium text-[#111518] dark:text-gray-200 pb-1.5">
                    Standard Check-in Time <span className="text-red-500">*</span>
                  </p>
                  <input
                    type="time"
                    value={formData.checkInTime}
                    onChange={(e) => handleChange('checkInTime', e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111518] dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#389cfa]/50 focus:border-[#389cfa]"
                    required
                  />
                </label>
              </div>

              <div>
                <label className="flex flex-col">
                  <p className="text-sm font-medium text-[#111518] dark:text-gray-200 pb-1.5">
                    Standard Check-out Time <span className="text-red-500">*</span>
                  </p>
                  <input
                    type="time"
                    value={formData.checkOutTime}
                    onChange={(e) => handleChange('checkOutTime', e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111518] dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#389cfa]/50 focus:border-[#389cfa]"
                    required
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#389cfa] hover:bg-[#389cfa]/90 transition-colors"
              >
                {initialData ? 'Update Branch' : 'Save Branch'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

// Main Branch Management Component
const BranchManagement = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [branches, setBranches] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isAddBranchModalOpen, setIsAddBranchModalOpen] = useState(false);
  const [isEditBranchModalOpen, setIsEditBranchModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchToDelete, setBranchToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toasts, setToasts] = useState([]);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  // Add toast notification
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Fetch branches
  const fetchBranches = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`/api/branches`, {
        params: {
          search: searchQuery || undefined,
          location: cityFilter !== 'all' ? cityFilter : undefined,
          page: currentPage,
          limit: 10
        }
      });

      if (response.data.success) {
        setBranches(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
      setError('Failed to fetch branches. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch locations for filter
  const fetchLocations = async () => {
    try {
      const response = await axios.get(`/api/branches/locations`);
      if (response.data.success) {
        setLocations(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, [searchQuery, cityFilter, currentPage]);

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleAddBranch = async (branchData) => {
    try {
      const response = await axios.post(`/api/branches`, branchData, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data.success) {
        setIsAddBranchModalOpen(false);
        fetchBranches();
        fetchLocations();
        showToast('Branch created successfully!', 'success');
      }
    } catch (error) {
      console.error('Error creating branch:', error);
      showToast(error.response?.data?.message || 'Failed to create branch', 'error');
    }
  };

  const handleUpdateBranch = async (branchData) => {
    try {
      const response = await axios.put(
        `/api/branches/${selectedBranch.hotel_id}`,
        branchData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.success) {
        setIsEditBranchModalOpen(false);
        setSelectedBranch(null);
        fetchBranches();
        fetchLocations();
        showToast('Branch updated successfully!', 'success');
      }
    } catch (error) {
      console.error('Error updating branch:', error);
      showToast(error.response?.data?.message || 'Failed to update branch', 'error');
    }
  };

  const handleDeleteClick = (branch) => {
    setBranchToDelete(branch);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!branchToDelete) return;

    try {
      const response = await axios.delete(`/api/branches/${branchToDelete.hotel_id}`);
      if (response.data.success) {
        setIsDeleteModalOpen(false);
        setBranchToDelete(null);
        fetchBranches();
        fetchLocations();
        showToast('Branch deleted successfully!', 'success');
      }
    } catch (error) {
      console.error('Error deleting branch:', error);
      showToast(error.response?.data?.message || 'Failed to delete branch', 'error');
      setIsDeleteModalOpen(false);
      setBranchToDelete(null);
    }
  };

  const handleEditClick = (branch) => {
    setSelectedBranch(branch);
    setIsEditBranchModalOpen(true);
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
        /* Hide scrollbar but keep functionality */
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>

      {/* Header Component */}
      <Header 
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        isUserMenuOpen={isUserMenuOpen}
        setIsUserMenuOpen={setIsUserMenuOpen}
        handleLogout={handleLogout}
      />

      {/* Toast Container */}
      <div className="fixed top-20 right-4 z-[60] flex flex-col gap-2 max-w-sm w-full px-4 sm:px-0">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

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
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black leading-tight tracking-[-0.033em] text-[#111518] dark:text-white">
                  Branch Management
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Manage hotel branches and locations
                </p>
              </div>
              <button 
                onClick={() => setIsAddBranchModalOpen(true)}
                className="flex items-center justify-center gap-2 px-4 h-10 rounded-lg bg-[#389cfa] text-white text-sm font-bold hover:bg-[#389cfa]/90 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Branch</span>
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex-1">
                <div className="flex items-stretch h-10 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-[#389cfa]/50">
                  <div className="flex items-center justify-center pl-3 text-gray-500 dark:text-gray-400">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search by name or location..."
                    className="flex-1 px-3 bg-transparent text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div className="w-full sm:w-auto">
                <select
                  value={cityFilter}
                  onChange={(e) => {
                    setCityFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full h-10 px-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#389cfa]/50"
                >
                  <option value="all">All Locations</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Branches Table */}
            <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-12 bg-white dark:bg-[#0f1923]">
                    <Loader2 className="w-8 h-8 animate-spin text-[#389cfa]" />
                  </div>
                ) : branches.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-[#0f1923]">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No branches found</p>
                  </div>
                ) : (
                  <div className="min-w-full">
                    {/* Desktop Table View */}
                    <table className="hidden md:table w-full text-sm">
                      <thead>
                        <tr className="bg-white dark:bg-[#0f1923] border-b border-gray-200 dark:border-gray-800">
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Branch Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Location
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Address
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Contact
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-[#0f1923] divide-y divide-gray-200 dark:divide-gray-800">
                        {branches.map((branch) => (
                          <tr
                            key={branch.hotel_id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                          >
                            <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                              {branch.hotel_name}
                            </td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                              {branch.branch_location}
                            </td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                              <div className="max-w-xs truncate">{branch.address}</div>
                            </td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                              <div>{branch.phone}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-500">{branch.email}</div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleEditClick(branch)}
                                  className="p-2 text-blue-500 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                                  title="Edit Branch"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(branch)}
                                  className="p-2 text-red-500 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                                  title="Delete Branch"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Mobile Card View */}
                    <div className="md:hidden bg-white dark:bg-[#0f1923] divide-y divide-gray-200 dark:divide-gray-800">
                      {branches.map((branch) => (
                        <div key={branch.hotel_id} className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                {branch.hotel_name}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {branch.branch_location}
                              </p>
                            </div>
                            <div className="flex gap-2 ml-2">
                              <button
                                onClick={() => handleEditClick(branch)}
                                className="p-2 text-blue-500 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(branch)}
                                className="p-2 text-red-500 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="space-y-1 text-sm">
                            <p className="text-gray-600 dark:text-gray-400">{branch.address}</p>
                            <p className="text-gray-600 dark:text-gray-400">{branch.phone}</p>
                            <p className="text-gray-500 dark:text-gray-500">{branch.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {!loading && branches.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center p-4 gap-4 bg-white dark:bg-[#0f1923] border-t border-gray-200 dark:border-gray-800">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Showing <span className="font-semibold text-gray-900 dark:text-white">{branches.length}</span> of{' '}
                    <span className="font-semibold text-gray-900 dark:text-white">{pagination.total}</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium px-2">
                      Page {currentPage} of {pagination.totalPages}
                    </div>

                    <button
                      onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                      disabled={currentPage === pagination.totalPages}
                      className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Add Branch Modal */}
      <BranchModal
        isOpen={isAddBranchModalOpen}
        onClose={() => setIsAddBranchModalOpen(false)}
        onConfirm={handleAddBranch}
        title="Add New Hotel Branch"
      />

      {/* Edit Branch Modal */}
      <BranchModal
        isOpen={isEditBranchModalOpen}
        onClose={() => {
          setIsEditBranchModalOpen(false);
          setSelectedBranch(null);
        }}
        onConfirm={handleUpdateBranch}
        title="Edit Hotel Branch"
        initialData={selectedBranch}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setBranchToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        branchName={branchToDelete?.hotel_name || ''}
      />
    </div>
  );
};

export default BranchManagement;
