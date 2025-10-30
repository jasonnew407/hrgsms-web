import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

const EditUserModal = ({ isOpen, onClose, user, onConfirm }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    branch: '',
    role: ''
  });
  const [branches, setBranches] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Load user data and fetch branches/roles when modal opens
  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        fullName: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        branch: user.branch || '',
        role: user.role || ''
      });
      fetchBranchesAndRoles();
    }
  }, [isOpen, user]);

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
      console.error('Error fetching data:', error.response?.data || error.message || error);
      setErrorMessage('Failed to load form data');
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      await onConfirm(formData);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg max-h-[85vh] flex flex-col bg-white dark:bg-[#0f1923] rounded-xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-5 py-4">
            <h3 className="text-xl font-bold text-[#333333] dark:text-white">Edit User</h3>
            <button
              onClick={onClose}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {errorMessage && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                <p className="text-red-600 dark:text-red-400 text-xs">{errorMessage}</p>
              </div>
            )}

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="flex flex-col w-full">
                  <p className="text-[#111518] dark:text-gray-200 text-sm font-medium pb-1.5">Full Name</p>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111518] dark:text-gray-200 text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6] transition-shadow"
                    placeholder="Enter user's full name"
                    required
                  />
                </label>
              </div>

              {/* Email */}
              <div>
                <label className="flex flex-col w-full">
                  <p className="text-[#111518] dark:text-gray-200 text-sm font-medium pb-1.5">Email Address</p>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111518] dark:text-gray-200 text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6] transition-shadow"
                    placeholder="e.g. user@morenahotels.com"
                    required
                  />
                </label>
              </div>

              {/* Phone and Branch in same row */}
              <div className="grid grid-cols-2 gap-3">
                {/* Phone */}
                <div>
                  <label className="flex flex-col w-full">
                    <p className="text-[#111518] dark:text-gray-200 text-sm font-medium pb-1.5">Phone</p>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111518] dark:text-gray-200 text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6] transition-shadow"
                      placeholder="Phone number"
                      required
                    />
                  </label>
                </div>

                {/* Branch - FIXED TO USE branch.location */}
                <div>
                  <label className="flex flex-col w-full">
                    <p className="text-[#111518] dark:text-gray-200 text-sm font-medium pb-1.5">Branch</p>
                    <select
                      value={formData.branch}
                      onChange={(e) => handleChange('branch', e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111518] dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6] transition-shadow appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2fsvg%22%20viewBox%3d%220%200%2020%2020%22%20fill%3d%22none%22%3e%3cpath%20stroke%3d%22%236b7280%22%20stroke-linecap%3d%22round%22%20stroke-linejoin%3d%22round%22%20stroke-width%3d%221.5%22%20d%3d%22M6%208l4%204%204-4%22%2f%3e%3c%2fsvg%3e')] bg-[length:1.2em] bg-[right_0.5rem_center] bg-no-repeat pr-8"
                      required
                    >
                      <option value="">Select Branch</option>
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.location}>
                          {branch.location}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="flex flex-col w-full">
                  <p className="text-[#111518] dark:text-gray-200 text-sm font-medium pb-1.5">Role</p>
                  <select
                    value={formData.role}
                    onChange={(e) => handleChange('role', e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111518] dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6] transition-shadow appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2fsvg%22%20viewBox%3d%220%200%2020%2020%22%20fill%3d%22none%22%3e%3cpath%20stroke%3d%22%236b7280%22%20stroke-linecap%3d%22round%22%20stroke-linejoin%3d%22round%22%20stroke-width%3d%221.5%22%20d%3d%22M6%208l4%204%204-4%22%2f%3e%3c%2fsvg%3e')] bg-[length:1.2em] bg-[right_0.5rem_center] bg-no-repeat pr-8"
                    required
                  >
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.name}>
                        {role.displayName}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-xl">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-bold transition-colors hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-[#3b82f6] text-white text-sm font-bold transition-colors hover:bg-[#3b82f6]/90 disabled:opacity-50 disabled:cursor-not-allowed gap-2"
            >
              {loading ? (
                <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <span>Confirm</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditUserModal;