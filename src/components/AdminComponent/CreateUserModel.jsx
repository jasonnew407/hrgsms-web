import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, RefreshCw } from 'lucide-react';
import axios from 'axios';

const CreateUserModel = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    branch: '',
    role: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [branches, setBranches] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch branches and roles when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchBranchesAndRoles();
    }
  }, [isOpen]);

  const fetchBranchesAndRoles = async () => {
    try {
      const [branchesRes, rolesRes] = await Promise.all([
        axios.get('/api/branches/branches-only'),
        axios.get('/api/roles')
      ]);

      if (branchesRes.data.success) {
        setBranches(branchesRes.data.data || []);
      }
      if (rolesRes.data.success) {
        setRoles(rolesRes.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessage('Failed to load form data');
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      await onSubmit(formData);
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        branch: '',
        role: '',
        password: ''
      });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-gray-900/60 dark:bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg max-h-[85vh] flex flex-col bg-white dark:bg-[#0f1923] rounded-xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-5 py-4">
            <h3 className="text-xl font-bold text-[#111518] dark:text-white">Create New User</h3>
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
                    className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111518] dark:text-gray-200 text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#389cfa]/50 focus:border-[#389cfa] transition-shadow"
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
                    className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111518] dark:text-gray-200 text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#389cfa]/50 focus:border-[#389cfa] transition-shadow"
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
                      className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111518] dark:text-gray-200 text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#389cfa]/50 focus:border-[#389cfa] transition-shadow"
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
                      className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111518] dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#389cfa]/50 focus:border-[#389cfa] transition-shadow appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2fsvg%22%20viewBox%3d%220%200%2020%2020%22%20fill%3d%22none%22%3e%3cpath%20stroke%3d%22%236b7280%22%20stroke-linecap%3d%22round%22%20stroke-linejoin%3d%22round%22%20stroke-width%3d%221.5%22%20d%3d%22M6%208l4%204%204-4%22%2f%3e%3c%2fsvg%3e')] bg-[length:1.2em] bg-[right_0.5rem_center] bg-no-repeat pr-8"
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
                    className="w-full h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111518] dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#389cfa]/50 focus:border-[#389cfa] transition-shadow appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2fsvg%22%20viewBox%3d%220%200%2020%2020%22%20fill%3d%22none%22%3e%3cpath%20stroke%3d%22%236b7280%22%20stroke-linecap%3d%22round%22%20stroke-linejoin%3d%22round%22%20stroke-width%3d%221.5%22%20d%3d%22M6%208l4%204%204-4%22%2f%3e%3c%2fsvg%3e')] bg-[length:1.2em] bg-[right_0.5rem_center] bg-no-repeat pr-8"
                    required
                  >
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.name}>
                        {role.displayName || role.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Temporary Password */}
              <div>
                <label className="flex flex-col w-full">
                  <div className="flex items-center justify-between pb-1.5">
                    <p className="text-[#111518] dark:text-gray-200 text-sm font-medium">Temporary Password</p>
                    <button
                      type="button"
                      onClick={generatePassword}
                      className="flex items-center gap-1 text-xs font-semibold text-[#389cfa] hover:text-[#389cfa]/80 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Generate</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      className="w-full h-10 px-3 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#111518] dark:text-gray-200 text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#389cfa]/50 focus:border-[#389cfa] transition-shadow"
                      placeholder="Generate or enter a password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </label>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-700 px-5 py-4 bg-gray-50 dark:bg-gray-900/50 rounded-b-xl">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#389cfa] hover:bg-[#389cfa]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <span>Save</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateUserModel;