import React, { useState, useEffect } from 'react';
import { Plus, ChevronDown, ChevronRight, Shield, Calendar, Hotel, Users, BarChart3, Settings, Building2, X } from 'lucide-react';
import axios from 'axios';
import HeaderNew from '../components/HeaderNew';
import Sidebar from '../components/SidebarNew';
import CreateRoleModal from '../components/AdminComponent/CreateRoleModel';

const RoleManagement = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState(false);
  const [isRolesListOpen, setIsRolesListOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Data state
  const [roles, setRoles] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Permission state - organized by modules
  const [permissions, setPermissions] = useState({
    bookings: {
      create: false,
      read: false,
      update: false,
      delete: false
    },
    rooms: {
      create: false,
      read: false,
      update: false,
      delete: false
    },
    users: {
      create: false,
      read: false,
      update: false,
      delete: false
    },
    reports: {
      view: false,
      export: false
    },
    settings: {
      view: false,
      edit: false
    }
  });

  // Branch access control
  const [branchAccess, setBranchAccess] = useState({
    all: false
  });

  // Expanded sections state
  const [expandedSections, setExpandedSections] = useState({
    bookings: true,
    rooms: true,
    users: true,
    reports: true,
    settings: true,
    branches: true
  });

  // Toast notification state
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success' // 'success', 'error', 'warning', 'info'
  });

  // Fetch all data on component mount
  useEffect(() => {
    fetchRoles();
    fetchBranches();
  }, []);

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ ...toast, show: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  // Fetch branches from API
  const fetchBranches = async () => {
    try {
      const res = await axios.get('/api/branches/branches-only', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (res.data.success) {
        // Transform API data to match UI format
        const transformedBranches = [
          { 
            id: 'all', 
            label: 'All Branches', 
            description: 'Access to all branch locations' 
          },
          ...res.data.data.map(branch => ({
            id: branch.id.toString(),
            label: branch.location,
            description: `${branch.location} branch access`
          }))
        ];
        
        setBranches(transformedBranches);
        
        // Initialize branchAccess state with all branch IDs
        const initialBranchAccess = { all: false };
        res.data.data.forEach(branch => {
          initialBranchAccess[branch.id.toString()] = false;
        });
        setBranchAccess(initialBranchAccess);
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
      // Fallback to just "All Branches" option
      setBranches([{
        id: 'all',
        label: 'All Branches',
        description: 'Access to all branch locations'
      }]);
      setBranchAccess({ all: false });
    }
  };

  // Fetch all roles
  const fetchRoles = async () => {
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.get('/api/roles', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (res.data.success) {
        setRoles(res.data.data || []);
        // If roles exist and no role is selected, select the first one
        if (res.data.data.length > 0 && !selectedRole) {
          const firstRole = res.data.data[0];
          setSelectedRole(firstRole.id);
          await fetchRoleDetails(firstRole.id);
        }
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      setError('Failed to fetch roles. Please try again.');
      showToast('Failed to fetch roles. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch single role details
  const fetchRoleDetails = async (roleId) => {
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.get(`/api/roles/${roleId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (res.data.success) {
        const role = res.data.data;
        setRoleName(role.name);
        setRoleDescription(role.description);
        
        // Set permissions with defaults
        const rolePermissions = role.permissions || {};
        setPermissions({
          bookings: rolePermissions.bookings || { create: false, read: false, update: false, delete: false },
          rooms: rolePermissions.rooms || { create: false, read: false, update: false, delete: false },
          users: rolePermissions.users || { create: false, read: false, update: false, delete: false },
          reports: rolePermissions.reports || { view: false, export: false },
          settings: rolePermissions.settings || { view: false, edit: false }
        });
        
        // Set branch access dynamically
        const initialBranchAccess = { all: false };
        branches.forEach(branch => {
          if (branch.id !== 'all') {
            initialBranchAccess[branch.id] = rolePermissions.branchAccess?.[branch.id] || false;
          }
        });
        
        // Check if "all" was selected in the saved role
        initialBranchAccess.all = rolePermissions.branchAccess?.all || false;
        
        setBranchAccess(rolePermissions.branchAccess || initialBranchAccess);
      }
    } catch (error) {
      console.error('Error fetching role details:', error);
      setError('Failed to fetch role details.');
      showToast('Failed to fetch role details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Create new role
  const handleCreateRole = async (newRoleData) => {
    setError('');
    
    try {
      const res = await axios.post('/api/roles', newRoleData, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (res.data.success) {
        console.log('Role created successfully');
        await fetchRoles(); // Refresh roles list
        setIsCreateRoleModalOpen(false);
        
        // Select the newly created role
        setSelectedRole(res.data.data.id);
        await fetchRoleDetails(res.data.data.id);
        
        // Show success toast
        showToast('Role created successfully!', 'success');
      }
    } catch (error) {
      console.error('Error creating role:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create role';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      throw error;
    }
  };

  // Update role
  const handleSave = async () => {
    if (!selectedRole) {
      showToast('No role selected', 'warning');
      return;
    }

    setError('');
    
    try {
      const roleData = {
        roleName,
        roleDescription,
        permissions,
        branchAccess
      };

      const res = await axios.put(`/api/roles/${selectedRole}`, roleData, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (res.data.success) {
        console.log('Role updated successfully');
        await fetchRoles(); // Refresh roles list
        showToast('Role updated successfully!', 'success');
      }
    } catch (error) {
      console.error('Error updating role:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update role';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    }
  };

  // Delete role
  const handleDelete = () => {
    if (!selectedRole) {
      showToast('No role selected', 'warning');
      return;
    }
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setShowDeleteConfirm(false);
    setError('');
    
    try {
      const res = await axios.delete(`/api/roles/${selectedRole}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (res.data.success) {
        console.log('Role deleted successfully');
        
        // Refresh roles list
        await fetchRoles();
        
        // Select another role if available
        const updatedRoles = roles.filter(r => r.id !== selectedRole);
        if (updatedRoles.length > 0) {
          const newSelectedRole = updatedRoles[0];
          setSelectedRole(newSelectedRole.id);
          await fetchRoleDetails(newSelectedRole.id);
        } else {
          // No roles left - reset everything
          setSelectedRole(null);
          setRoleName('');
          setRoleDescription('');
          setPermissions({
            bookings: { create: false, read: false, update: false, delete: false },
            rooms: { create: false, read: false, update: false, delete: false },
            users: { create: false, read: false, update: false, delete: false },
            reports: { view: false, export: false },
            settings: { view: false, edit: false }
          });
          
          // Reset branch access to initial state
          const initialBranchAccess = { all: false };
          branches.forEach(branch => {
            if (branch.id !== 'all') {
              initialBranchAccess[branch.id] = false;
            }
          });
          setBranchAccess(initialBranchAccess);
        }
        
        showToast('Role deleted successfully!', 'success');
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete role';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  const permissionModules = {
    bookings: {
      title: 'Booking Management',
      icon: Calendar,
      iconColor: 'text-blue-500',
      permissions: [
        { id: 'create', label: 'Create Bookings', description: 'Create new reservations' },
        { id: 'read', label: 'View Bookings', description: 'View booking details' },
        { id: 'update', label: 'Modify Bookings', description: 'Edit existing bookings' },
        { id: 'delete', label: 'Cancel Bookings', description: 'Cancel reservations' }
      ]
    },
    rooms: {
      title: 'Room Management',
      icon: Hotel,
      iconColor: 'text-purple-500',
      permissions: [
        { id: 'create', label: 'Add Rooms', description: 'Add new room inventory' },
        { id: 'read', label: 'View Rooms', description: 'View room information' },
        { id: 'update', label: 'Update Rooms', description: 'Modify room details' },
        { id: 'delete', label: 'Remove Rooms', description: 'Delete rooms' }
      ]
    },
    users: {
      title: 'User Management',
      icon: Users,
      iconColor: 'text-green-500',
      permissions: [
        { id: 'create', label: 'Create Users', description: 'Add new staff members' },
        { id: 'read', label: 'View Users', description: 'View user profiles' },
        { id: 'update', label: 'Edit Users', description: 'Modify user details' },
        { id: 'delete', label: 'Delete Users', description: 'Remove users' }
      ]
    },
    reports: {
      title: 'Reports & Analytics',
      icon: BarChart3,
      iconColor: 'text-orange-500',
      permissions: [
        { id: 'view', label: 'View Reports', description: 'Access reports dashboard' },
        { id: 'export', label: 'Export Data', description: 'Download report data' }
      ]
    },
    settings: {
      title: 'System Settings',
      icon: Settings,
      iconColor: 'text-gray-500',
      permissions: [
        { id: 'view', label: 'View Settings', description: 'View system configuration' },
        { id: 'edit', label: 'Modify Settings', description: 'Change system settings' }
      ]
    }
  };

  const handleRoleChange = async (roleId) => {
    setSelectedRole(roleId);
    await fetchRoleDetails(roleId);
    setIsRolesListOpen(false);
  };

  const handlePermissionChange = (module, permission) => {
    setPermissions(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [permission]: !prev[module][permission]
      }
    }));
  };

  const handleBranchAccessChange = (branchId) => {
    if (branchId === 'all') {
      // If "all" is selected, deselect individual branches
      const newBranchAccess = { all: !branchAccess.all };
      branches.forEach(branch => {
        if (branch.id !== 'all') {
          newBranchAccess[branch.id] = false;
        }
      });
      setBranchAccess(newBranchAccess);
    } else {
      // If individual branch is selected, deselect "all"
      setBranchAccess(prev => ({
        ...prev,
        all: false,
        [branchId]: !prev[branchId]
      }));
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSelectAllInModule = (module) => {
    const allChecked = Object.values(permissions[module]).every(val => val);
    const newModulePermissions = {};
    Object.keys(permissions[module]).forEach(key => {
      newModulePermissions[key] = !allChecked;
    });
    setPermissions(prev => ({
      ...prev,
      [module]: newModulePermissions
    }));
  };

  // Toast icon based on type
  const getToastIcon = () => {
    switch (toast.type) {
      case 'success':
        return (
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getToastBgColor = () => {
    switch (toast.type) {
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

  const getToastTextColor = () => {
    switch (toast.type) {
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
    <div className="flex flex-col h-screen bg-[#f5f7f8] dark:bg-[#0f1923] overflow-hidden">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${getToastBgColor()}`}>
            {getToastIcon()}
            <p className={`text-sm font-medium ${getToastTextColor()}`}>
              {toast.message}
            </p>
            <button
              onClick={() => setToast({ ...toast, show: false })}
              className={`ml-2 ${getToastTextColor()} hover:opacity-70 transition-opacity`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

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
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#389cfa]"></div>
            </div>
          )}

          {/* Main Content */}
          {!loading && (
            <div className="flex flex-col lg:flex-row h-full gap-4 sm:gap-6">
              {/* Mobile: Role Selector Dropdown */}
              <div className="lg:hidden w-full">
                <button
                  onClick={() => setIsRolesListOpen(!isRolesListOpen)}
                  className="flex w-full items-center justify-between h-12 px-4 bg-white dark:bg-[#0f1923] border border-gray-200 dark:border-gray-800 rounded-lg text-[#111518] dark:text-gray-200 font-medium"
                >
                  <span className="text-sm">{roleName || 'Select a role'}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${isRolesListOpen ? 'rotate-180' : ''}`} />
                </button>

                {isRolesListOpen && (
                  <div className="mt-2 w-full bg-white dark:bg-[#0f1923] border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    {roles.map((role) => (
                      <button
                        key={role.id}
                        onClick={() => handleRoleChange(role.id)}
                        className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                          selectedRole === role.id
                            ? 'bg-[#389cfa]/10 text-[#389cfa]'
                            : 'text-[#111518] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        {role.name}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        setIsCreateRoleModalOpen(true);
                        setIsRolesListOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-white bg-[#389cfa] hover:bg-[#389cfa]/90 transition-colors border-t border-gray-200 dark:border-gray-800"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create New Role</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Desktop: Left Panel - Roles List */}
              <div className="hidden lg:flex flex-col w-full lg:w-1/3 lg:max-w-sm bg-white dark:bg-[#0f1923] border border-gray-200 dark:border-gray-800 rounded-xl">
                <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="text-lg font-bold text-[#111518] dark:text-gray-200">Roles</h3>
                </div>

                <div className="flex flex-col p-4 gap-3 flex-grow overflow-y-auto">
                  {roles.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
                      No roles found. Create your first role.
                    </p>
                  ) : (
                    roles.map((role) => (
                      <label
                        key={role.id}
                        className={`flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-colors ${
                          selectedRole === role.id
                            ? 'bg-[#389cfa]/10 border-[#389cfa] dark:bg-[#389cfa]/20'
                            : 'border-gray-300 dark:border-gray-700 hover:border-[#389cfa]/50 dark:hover:border-[#389cfa]/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="role-selection"
                          value={role.id}
                          checked={selectedRole === role.id}
                          onChange={() => handleRoleChange(role.id)}
                          className="h-5 w-5 border-2 border-gray-300 dark:border-gray-600 bg-transparent text-transparent checked:border-[#389cfa] checked:bg-[radial-gradient(circle,#389cfa_40%,transparent_40%)] focus:outline-none focus:ring-0"
                        />
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${selectedRole === role.id ? 'text-[#111518] dark:text-white' : 'text-[#111518] dark:text-gray-300'}`}>
                            {role.name}
                          </p>
                          {role.permissionsCount !== undefined && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {role.permissionsCount} permissions
                            </p>
                          )}
                        </div>
                      </label>
                    ))
                  )}
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                  <button 
                    onClick={() => setIsCreateRoleModalOpen(true)}
                    className="flex w-full items-center justify-center gap-2 h-10 px-4 bg-[#389cfa] text-white text-sm font-bold rounded-lg hover:bg-[#389cfa]/90 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New Role</span>
                  </button>
                </div>
              </div>

              {/* Right Panel: Role Details */}
              <div className="flex flex-col flex-1 bg-white dark:bg-[#0f1923] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                {selectedRole ? (
                  <>
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                      <h1 className="text-lg sm:text-xl font-bold text-[#111518] dark:text-gray-200">
                        Editing: {roleName}
                      </h1>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
                      {/* Role Details Section */}
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-[#111518] dark:text-gray-200 mb-3 sm:mb-4">Role Details</h3>
                        <div className="space-y-3 sm:space-y-4">
                          <div>
                            <label htmlFor="role-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Role Name
                            </label>
                            <input
                              id="role-name"
                              type="text"
                              value={roleName}
                              onChange={(e) => setRoleName(e.target.value)}
                              className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#111518] dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#389cfa]/50 focus:border-[#389cfa]"
                            />
                          </div>

                          <div>
                            <label htmlFor="role-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Role Description
                            </label>
                            <textarea
                              id="role-description"
                              rows="3"
                              value={roleDescription}
                              onChange={(e) => setRoleDescription(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#111518] dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#389cfa]/50 focus:border-[#389cfa]"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Permissions Builder Section */}
                      <div>
                        <div className="flex items-center gap-2 mb-3 sm:mb-4">
                          <Shield className="w-5 h-5 text-[#389cfa]" />
                          <h3 className="text-base sm:text-lg font-bold text-[#111518] dark:text-gray-200">Permissions</h3>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4">
                          Configure what this role can access and modify
                        </p>

                        <div className="space-y-3">
                          {/* Permission Modules */}
                          {Object.entries(permissionModules).map(([moduleKey, module]) => {
                            const allChecked = Object.values(permissions[moduleKey]).every(val => val);
                            const IconComponent = module.icon;

                            return (
                              <div key={moduleKey} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                <button
                                  onClick={() => toggleSection(moduleKey)}
                                  className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg bg-white dark:bg-gray-800 ${module.iconColor}`}>
                                      <IconComponent className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                      <h4 className="text-sm font-semibold text-[#111518] dark:text-gray-200">{module.title}</h4>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {Object.values(permissions[moduleKey]).filter(v => v).length} of {Object.keys(permissions[moduleKey]).length} enabled
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSelectAllInModule(moduleKey);
                                      }}
                                      className="text-xs font-medium text-[#389cfa] hover:text-[#389cfa]/80 px-2 py-1 rounded hover:bg-[#389cfa]/10"
                                    >
                                      {allChecked ? 'Deselect All' : 'Select All'}
                                    </button>
                                    <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections[moduleKey] ? 'rotate-90' : ''}`} />
                                  </div>
                                </button>

                                {expandedSections[moduleKey] && (
                                  <div className="p-4 space-y-2 bg-white dark:bg-[#0f1923]">
                                    {module.permissions.map((perm) => (
                                      <label
                                        key={perm.id}
                                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-pointer group"
                                      >
                                        <input
                                          type="checkbox"
                                          checked={permissions[moduleKey][perm.id] || false}
                                          onChange={() => handlePermissionChange(moduleKey, perm.id)}
                                          className="mt-0.5 h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-[#389cfa] focus:ring-[#389cfa]/50"
                                        />
                                        <div className="flex-1">
                                          <p className="text-sm font-medium text-[#111518] dark:text-gray-200">
                                            {perm.label}
                                          </p>
                                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                            {perm.description}
                                          </p>
                                        </div>
                                      </label>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}

                          {/* Branch Access Control */}
                          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                            <button
                              onClick={() => toggleSection('branches')}
                              className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-white dark:bg-gray-800 text-indigo-500">
                                  <Building2 className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                  <h4 className="text-sm font-semibold text-[#111518] dark:text-gray-200">Branch Access</h4>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {branchAccess.all 
                                      ? 'All branches' 
                                      : `${Object.entries(branchAccess).filter(([key, val]) => key !== 'all' && val).length} branches`
                                    }
                                  </p>
                                </div>
                              </div>
                              <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expandedSections.branches ? 'rotate-90' : ''}`} />
                            </button>

                            {expandedSections.branches && (
                              <div className="p-4 space-y-2 bg-white dark:bg-[#0f1923]">
                                {branches.length === 0 ? (
                                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                                    Loading branches...
                                  </p>
                                ) : (
                                  branches.map((branch) => (
                                    <label
                                      key={branch.id}
                                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-pointer group"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={branchAccess[branch.id] || false}
                                        onChange={() => handleBranchAccessChange(branch.id)}
                                        className="mt-0.5 h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-[#389cfa] focus:ring-[#389cfa]/50"
                                      />
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-[#111518] dark:text-gray-200">
                                          {branch.label}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                          {branch.description}
                                        </p>
                                      </div>
                                    </label>
                                  ))
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                      <button
                        onClick={handleDelete}
                        className="flex items-center justify-center gap-2 h-10 px-4 bg-red-600/10 text-red-600 text-sm font-bold rounded-lg hover:bg-red-600/20 transition-colors order-2 sm:order-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Delete Role</span>
                      </button>
                      <button
                        onClick={handleSave}
                        className="flex items-center justify-center h-10 px-4 bg-[#389cfa] text-white text-sm font-bold rounded-lg hover:bg-[#389cfa]/90 transition-colors order-1 sm:order-2"
                      >
                        Save Changes
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <Shield className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-2">
                      No Role Selected
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                      Select a role from the list or create a new one to get started
                    </p>
                    <button 
                      onClick={() => setIsCreateRoleModalOpen(true)}
                      className="flex items-center gap-2 h-10 px-6 bg-[#389cfa] text-white text-sm font-bold rounded-lg hover:bg-[#389cfa]/90 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create New Role</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      <CreateRoleModal
        isOpen={isCreateRoleModalOpen}
        onClose={() => setIsCreateRoleModalOpen(false)}
        onConfirm={handleCreateRole}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-[#0f1923] rounded-xl shadow-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20">
                  <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#111518] dark:text-white">Confirm Delete</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete the role <strong>"{roleName}"</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
                >
                  Delete Role
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RoleManagement;