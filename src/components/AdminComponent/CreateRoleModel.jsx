import React, { useState, useEffect } from 'react';
import { X, Plus, Shield, ChevronRight, Calendar, Hotel, Users, BarChart3, Settings, Building2 } from 'lucide-react';
import axios from 'axios';

const CreateRoleModal = ({ isOpen, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    roleName: '',
    roleDescription: ''
  });

  const [permissions, setPermissions] = useState({
    bookings: { create: false, read: false, update: false, delete: false },
    rooms: { create: false, read: false, update: false, delete: false },
    users: { create: false, read: false, update: false, delete: false },
    reports: { view: false, export: false },
    settings: { view: false, edit: false }
  });

  const [branchAccess, setBranchAccess] = useState({
    all: false
  });

  const [branches, setBranches] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(false);

  const [expandedSections, setExpandedSections] = useState({
    bookings: false,
    rooms: false,
    users: false,
    reports: false,
    settings: false,
    branches: false
  });

  // Fetch branches when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchBranches();
    }
  }, [isOpen]);

  const fetchBranches = async () => {
    setLoadingBranches(true);
    try {
      const res = await axios.get('/api/hotels/branches');
      
      if (res.data.success) {
        const fetchedBranches = res.data.data || [];
        setBranches(fetchedBranches);
        
        // Initialize branch access state based on fetched branches
        const initialBranchAccess = { all: false };
        fetchedBranches.forEach(branch => {
          initialBranchAccess[branch.id] = false;
        });
        setBranchAccess(initialBranchAccess);
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
      // Fallback to empty array if API fails
      setBranches([]);
      setBranchAccess({ all: false });
    } finally {
      setLoadingBranches(false);
    }
  };

  const permissionModules = {
    bookings: {
      title: 'Booking Management',
      icon: Calendar,
      iconColor: 'text-blue-500',
      permissions: [
        { id: 'create', label: 'Create Bookings' },
        { id: 'read', label: 'View Bookings' },
        { id: 'update', label: 'Modify Bookings' },
        { id: 'delete', label: 'Cancel Bookings' }
      ]
    },
    rooms: {
      title: 'Room Management',
      icon: Hotel,
      iconColor: 'text-purple-500',
      permissions: [
        { id: 'create', label: 'Add Rooms' },
        { id: 'read', label: 'View Rooms' },
        { id: 'update', label: 'Update Rooms' },
        { id: 'delete', label: 'Remove Rooms' }
      ]
    },
    users: {
      title: 'User Management',
      icon: Users,
      iconColor: 'text-green-500',
      permissions: [
        { id: 'create', label: 'Create Users' },
        { id: 'read', label: 'View Users' },
        { id: 'update', label: 'Edit Users' },
        { id: 'delete', label: 'Delete Users' }
      ]
    },
    reports: {
      title: 'Reports & Analytics',
      icon: BarChart3,
      iconColor: 'text-orange-500',
      permissions: [
        { id: 'view', label: 'View Reports' },
        { id: 'export', label: 'Export Data' }
      ]
    },
    settings: {
      title: 'System Settings',
      icon: Settings,
      iconColor: 'text-gray-500',
      permissions: [
        { id: 'view', label: 'View Settings' },
        { id: 'edit', label: 'Modify Settings' }
      ]
    }
  };

  const branchesForDisplay = [
    { id: 'all', label: 'All Branches', location: 'All Branches' },
    ...branches.map(branch => ({
      id: branch.id,
      label: branch.location,
      location: branch.location
    }))
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.roleName || !formData.roleDescription) {
      alert('Please fill in all required fields');
      return;
    }

    const roleData = {
      roleName: formData.roleName,
      roleDescription: formData.roleDescription,
      permissions,
      branchAccess
    };

    try {
      await onConfirm(roleData);
      resetForm();
    } catch (error) {
      console.error('Error creating role:', error);
      // Error is already handled in parent component
    }
  };

  const resetForm = () => {
    setFormData({ roleName: '', roleDescription: '' });
    setPermissions({
      bookings: { create: false, read: false, update: false, delete: false },
      rooms: { create: false, read: false, update: false, delete: false },
      users: { create: false, read: false, update: false, delete: false },
      reports: { view: false, export: false },
      settings: { view: false, edit: false }
    });
    
    // Reset branch access based on current branches
    const resetBranchAccess = { all: false };
    branches.forEach(branch => {
      resetBranchAccess[branch.id] = false;
    });
    setBranchAccess(resetBranchAccess);
    
    setExpandedSections({
      bookings: false,
      rooms: false,
      users: false,
      reports: false,
      settings: false,
      branches: false
    });
    onClose();
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
      const newAllValue = !branchAccess.all;
      const updatedAccess = { all: newAllValue };
      
      // Set all branches to false when "all" is selected
      branches.forEach(branch => {
        updatedAccess[branch.id] = false;
      });
      
      setBranchAccess(updatedAccess);
    } else {
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

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl max-h-[90vh] flex flex-col bg-white dark:bg-[#0f1923] rounded-xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#389cfa]/10">
                <Shield className="w-5 h-5 text-[#389cfa]" />
              </div>
              <h3 className="text-xl font-bold text-[#111518] dark:text-white">Create New Role</h3>
            </div>
            <button
              onClick={resetForm}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#111518] dark:text-gray-200 pb-1.5">
                  Role Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.roleName}
                  onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111518] dark:text-gray-200 text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#389cfa]/50 focus:border-[#389cfa]"
                  placeholder="e.g., Guest Manager, Receptionist"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111518] dark:text-gray-200 pb-1.5">
                  Role Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="2"
                  value={formData.roleDescription}
                  onChange={(e) => setFormData({ ...formData, roleDescription: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111518] dark:text-gray-200 text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#389cfa]/50 focus:border-[#389cfa]"
                  placeholder="Describe the role and its responsibilities..."
                  required
                />
              </div>
            </div>

            {/* Permissions */}
            <div>
              <h4 className="text-sm font-semibold text-[#111518] dark:text-gray-200 mb-3">Permissions</h4>
              <div className="space-y-2">
                {Object.entries(permissionModules).map(([moduleKey, module]) => {
                  const IconComponent = module.icon;
                  const enabledCount = Object.values(permissions[moduleKey]).filter(v => v).length;

                  return (
                    <div key={moduleKey} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => toggleSection(moduleKey)}
                        className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className={`w-4 h-4 ${module.iconColor}`} />
                          <span className="text-sm font-medium text-[#111518] dark:text-gray-200">{module.title}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ({enabledCount}/{module.permissions.length})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectAllInModule(moduleKey);
                            }}
                            className="text-xs font-medium text-[#389cfa] hover:text-[#389cfa]/80 px-2 py-1"
                          >
                            {enabledCount === module.permissions.length ? 'Clear' : 'All'}
                          </button>
                          <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections[moduleKey] ? 'rotate-90' : ''}`} />
                        </div>
                      </button>

                      {expandedSections[moduleKey] && (
                        <div className="p-3 space-y-2 bg-white dark:bg-[#0f1923]">
                          {module.permissions.map((perm) => (
                            <label
                              key={perm.id}
                              className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={permissions[moduleKey][perm.id] || false}
                                onChange={() => handlePermissionChange(moduleKey, perm.id)}
                                className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-[#389cfa] focus:ring-[#389cfa]/50"
                              />
                              <span className="text-sm text-[#111518] dark:text-gray-200">{perm.label}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Branch Access */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection('branches')}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Building2 className="w-4 h-4 text-indigo-500" />
                      <span className="text-sm font-medium text-[#111518] dark:text-gray-200">Branch Access</span>
                      {loadingBranches ? (
                        <span className="text-xs text-gray-500 dark:text-gray-400">Loading...</span>
                      ) : (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ({Object.values(branchAccess).filter(v => v).length}/{branchesForDisplay.length})
                        </span>
                      )}
                    </div>
                    <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${expandedSections.branches ? 'rotate-90' : ''}`} />
                  </button>

                  {expandedSections.branches && (
                    <div className="p-3 space-y-2 bg-white dark:bg-[#0f1923]">
                      {loadingBranches ? (
                        <div className="flex justify-center items-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#389cfa]"></div>
                        </div>
                      ) : branchesForDisplay.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                          No branches available
                        </p>
                      ) : (
                        branchesForDisplay.map((branch) => (
                          <label
                            key={branch.id}
                            className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800/30 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={branchAccess[branch.id] || false}
                              onChange={() => handleBranchAccessChange(branch.id)}
                              className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-[#389cfa] focus:ring-[#389cfa]/50"
                            />
                            <span className="text-sm text-[#111518] dark:text-gray-200">{branch.label}</span>
                          </label>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-700 px-5 py-4 bg-gray-50 dark:bg-gray-900/50 rounded-b-xl">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#389cfa] hover:bg-[#389cfa]/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Role</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateRoleModal;