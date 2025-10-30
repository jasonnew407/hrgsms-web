import React, { useState, useRef, useEffect } from 'react';
import { Plus, MoreVertical, Edit2, LockOpen, Lock, Trash2, CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import axios from 'axios';
import HeaderNew from '../components/HeaderNew';
import Sidebar from '../components/SidebarNew';
import CreateUserModal from '../components/AdminComponent/CreateUserModel';
import UnlockAccountModal from '../components/AdminComponent/UnlockAccountModel';
import BlockAccountModal from '../components/AdminComponent/BlockAccountModel';
import DeleteUserModal from '../components/AdminComponent/DeleteUserModel';
import EditUserModal from '../components/AdminComponent/EditUserModel';

// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />
  };

  const styles = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200'
  };

  return (
    <div className={`flex items-center gap-3 min-w-[320px] px-4 py-3 rounded-lg border shadow-lg ${styles[type]} animate-slide-in-right`}>
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Toast Container Component
const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

// UserActionsDropdown Component
const UserActionsDropdown = ({ user, onUnblock, onEdit, onBlock, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleAction = (action) => {
    setIsOpen(false);
    action();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white dark:bg-[#0f1923] shadow-lg border border-gray-200 dark:border-gray-700 z-10">
          <div className="py-1">
            <button
              onClick={() => handleAction(onEdit)}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit User</span>
            </button>

            {user.status === 'Locked' || user.status === 'Inactive' ? (
              <button
                onClick={() => handleAction(onUnblock)}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <LockOpen className="w-4 h-4" />
                <span>Unblock User</span>
              </button>
            ) : (
              <button
                onClick={() => handleAction(onBlock)}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-yellow-600 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Lock className="w-4 h-4" />
                <span>Block User</span>
              </button>
            )}

            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

            <button
              onClick={() => handleAction(onDelete)}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete User</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Main UserManagement Component
const UserManagement = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Toast functions
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  // Fetch branches and roles on mount
  useEffect(() => {
    fetchBranchesAndRoles();
  }, []);

  const fetchBranchesAndRoles = async () => {
    try {
      const [branchesRes, rolesRes] = await Promise.all([
        axios.get('/api/branches/branches-only'),
        axios.get('/api/roles')
      ]);

      if (branchesRes.status >= 200 && branchesRes.status < 300) {
        setBranches(branchesRes.data.data || []);
      }
      if (rolesRes.status >= 200 && rolesRes.status < 300) {
        setRoles(rolesRes.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching filter data:', error.response?.data || error.message || error);
      addToast('Failed to load filters', 'error');
    }
  };

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedBranch && selectedBranch !== 'All') params.append('branch', selectedBranch);
      if (selectedRole && selectedRole !== 'All') params.append('role', selectedRole);
      if (selectedStatus && selectedStatus !== 'All') params.append('status', selectedStatus);

      const res = await axios.get(`/api/users?${params.toString()}`);
      
      if (res.status >= 200 && res.status < 300) {
        setUsers(res.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error.response?.data || error.message || error);
      addToast('Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on component mount and when filters change
  useEffect(() => {
    fetchUsers();
  }, [searchQuery, selectedBranch, selectedRole, selectedStatus]);

  const handleUnlockClick = (user) => {
    setSelectedUser(user);
    setIsUnlockModalOpen(true);
  };

  const handleBlockClick = (user) => {
    setSelectedUser(user);
    setIsBlockModalOpen(true);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleUnlockConfirm = async () => {
    try {
      const res = await axios.patch(`/api/users/${selectedUser.id}/unblock`);
      
      if (res.status >= 200 && res.status < 300) {
        addToast('User account unlocked successfully', 'success');
        await fetchUsers();
        setIsUnlockModalOpen(false);
      }
    } catch (error) {
      console.error('Error unlocking user:', error.response?.data || error.message || error);
      addToast(error.response?.data?.message || 'Failed to unlock user account', 'error');
    }
  };

  const handleBlockConfirm = async () => {
    try {
      const res = await axios.patch(`/api/users/${selectedUser.id}/block`);
      
      if (res.status >= 200 && res.status < 300) {
        addToast('User account blocked successfully', 'success');
        await fetchUsers();
        setIsBlockModalOpen(false);
      }
    } catch (error) {
      console.error('Error blocking user:', error.response?.data || error.message || error);
      addToast(error.response?.data?.message || 'Failed to block user account', 'error');
    }
  };

  const handleEditConfirm = async (userData) => {
    try {
      const res = await axios.put(`/api/users/${selectedUser.id}`, userData, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (res.status >= 200 && res.status < 300) {
        addToast('User updated successfully', 'success');
        await fetchUsers();
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error('Error updating user:', error.response?.data || error.message || error);
      addToast(error.response?.data?.message || 'Failed to update user', 'error');
      throw error;
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await axios.delete(`/api/users/${selectedUser.id}`);
      
      if (res.status >= 200 && res.status < 300) {
        addToast('User deleted successfully', 'success');
        await fetchUsers();
        setIsDeleteModalOpen(false);
      }
    } catch (error) {
      console.error('Error deleting user:', error.response?.data || error.message || error);
      addToast(error.response?.data?.message || 'Failed to delete user', 'error');
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      const res = await axios.post('/api/users', userData, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (res.status >= 200 && res.status < 300) {
        addToast('User created successfully', 'success');
        await fetchUsers();
        setIsCreateModalOpen(false);
      }
    } catch (error) {
      console.error('Error creating user:', error.response?.data || error.message || error);
      addToast(error.response?.data?.message || 'Failed to create user', 'error');
      throw error;
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      'Branch Manager': 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
      'Manager': 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
      'Front Desk': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
      'Front_Desk': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
      'Concierge': 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
      'Service Staff': 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
      'Service_Staff': 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300',
      'Housekeeping': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      'Admin': 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status) => {
    const badges = {
      'Active': {
        color: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
        dotColor: 'bg-green-500'
      },
      'Inactive': {
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
        dotColor: 'bg-yellow-500'
      },
      'Locked': {
        color: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
        dotColor: 'bg-red-500'
      }
    };
    return badges[status] || badges['Active'];
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
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <HeaderNew 
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        isUserMenuOpen={isUserMenuOpen}
        setIsUserMenuOpen={setIsUserMenuOpen}
        handleLogout={handleLogout}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isSidebarExpanded={isSidebarExpanded}
          toggleSidebar={toggleSidebar}
          isMobileSidebarOpen={isMobileSidebarOpen}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
          handleLogout={handleLogout}
        />

        <main className="flex-1 p-4 sm:p-6 bg-[#f5f7f8] dark:bg-[#0f1923] overflow-y-auto hide-scrollbar">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h1 className="text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em] text-[#111518] dark:text-white">
                User Management
              </h1>
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center justify-center gap-2 px-4 h-10 bg-[#389cfa] hover:bg-[#389cfa]/90 text-white text-sm font-bold rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Add New User</span>
              </button>
            </div>

            <div className="mb-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f1923] p-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Search */}
                <div className="md:col-span-2">
                  <div className="flex items-stretch h-12 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-center px-4 bg-[#f5f7f8] dark:bg-gray-800 text-gray-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name or email..."
                      className="flex-1 px-4 bg-[#f5f7f8] dark:bg-gray-800 text-[#111518] dark:text-white placeholder:text-gray-500 focus:outline-none text-sm"
                    />
                  </div>
                </div>

                {/* Filter Dropdowns */}
                <div className="flex gap-3 md:col-span-3">
                  {/* Branch Filter */}
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="flex-1 h-12 px-4 rounded-lg bg-[#f5f7f8] dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2fsvg%22%20viewBox%3d%220%200%2020%2020%22%20fill%3d%22none%22%3e%3cpath%20stroke%3d%22%236b7280%22%20stroke-linecap%3d%22round%22%20stroke-linejoin%3d%22round%22%20stroke-width%3d%221.5%22%20d%3d%22M6%208l4%204%204-4%22%2f%3e%3c%2fsvg%3e')] bg-[length:1.2em] bg-[right_0.5rem_center] bg-no-repeat pr-8 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#389cfa]/50"
                  >
                    <option value="All">Branch: All</option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.location}>
                        Branch: {branch.location}
                      </option>
                    ))}
                  </select>

                  {/* Role Filter */}
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="flex-1 h-12 px-4 rounded-lg bg-[#f5f7f8] dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2fsvg%22%20viewBox%3d%220%200%2020%2020%22%20fill%3d%22none%22%3e%3cpath%20stroke%3d%22%236b7280%22%20stroke-linecap%3d%22round%22%20stroke-linejoin%3d%22round%22%20stroke-width%3d%221.5%22%20d%3d%22M6%208l4%204%204-4%22%2f%3e%3c%2fsvg%3e')] bg-[length:1.2em] bg-[right_0.5rem_center] bg-no-repeat pr-8 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#389cfa]/50"
                  >
                    <option value="All">Role: All</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.name}>
                        Role: {role.displayName}
                      </option>
                    ))}
                  </select>

                  {/* Status Filter */}
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="flex-1 h-12 px-4 rounded-lg bg-[#f5f7f8] dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2fsvg%22%20viewBox%3d%220%200%2020%2020%22%20fill%3d%22none%22%3e%3cpath%20stroke%3d%22%236b7280%22%20stroke-linecap%3d%22round%22%20stroke-linejoin%3d%22round%22%20stroke-width%3d%221.5%22%20d%3d%22M6%208l4%204%204-4%22%2f%3e%3c%2fsvg%3e')] bg-[length:1.2em] bg-[right_0.5rem_center] bg-no-repeat pr-8 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#389cfa]/50"
                  >
                    <option value="All">Status: All</option>
                    <option value="Active">Status: Active</option>
                    <option value="Inactive">Status: Inactive</option>
                    <option value="Locked">Status: Locked</option>
                  </select>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#389cfa]"></div>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white dark:bg-[#0f1923]">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          User Info
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          Branch
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          Role
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          Last Login
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-[#0f1923] divide-y divide-gray-200 dark:divide-gray-800">
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                            No users found
                          </td>
                        </tr>
                      ) : (
                        users.map((user) => {
                          const statusBadge = getStatusBadge(user.status);
                          return (
                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                  <div>
                                    <p className="text-sm font-semibold text-[#111518] dark:text-white">
                                      {user.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {user.email}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                {user.branch}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge.color}`}>
                                  <span className={`w-2 h-2 rounded-full ${statusBadge.dotColor}`}></span>
                                  {user.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                {user.lastLogin}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">
                                <UserActionsDropdown
                                  user={user}
                                  onUnblock={() => handleUnlockClick(user)}
                                  onEdit={() => handleEditClick(user)}
                                  onBlock={() => handleBlockClick(user)}
                                  onDelete={() => handleDeleteClick(user)}
                                />
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <CreateUserModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateUser}
      />

      <UnlockAccountModal
        isOpen={isUnlockModalOpen}
        onClose={() => setIsUnlockModalOpen(false)}
        userEmail={selectedUser?.email}
        onConfirm={handleUnlockConfirm}
      />

      <BlockAccountModal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        userEmail={selectedUser?.email}
        onConfirm={handleBlockConfirm}
      />

      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        userName={selectedUser?.name}
        onConfirm={handleDeleteConfirm}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={selectedUser}
        onConfirm={handleEditConfirm}
      />
    </div>
  );
};

export default UserManagement;