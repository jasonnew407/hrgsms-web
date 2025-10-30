import React, { useState, useRef, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import HeaderNew from '../components/HeaderNew';
import Sidebar from '../components/SidebarNew';

const EditProfile = () => {
  // Sidebar & UI State
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Profile Image State
  const [profileImage, setProfileImage] = useState('');
  const [showCropper, setShowCropper] = useState(false);
  const [zoom, setZoom] = useState(1.2);
  const fileInputRef = useRef(null);

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    branch: '',
    role: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Original data for comparison
  const [originalData, setOriginalData] = useState(null);

  // Fetch user profile on mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      
      // Token is in httpOnly cookie, so we don't need to send it manually
      // But if your auth uses Bearer token from localStorage, use that approach
      const token = localStorage.getItem('token');
      
      const headers = {
        'Content-Type': 'application/json'
      };
      
      // Add Authorization header if token exists in localStorage
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'GET',
        headers: headers,
        credentials: 'include' // Important: Include cookies
      });

      const result = await response.json();

      if (result.success) {
        const user = result.data;
        const userData = {
          firstName: user.first_name || '',
          lastName: user.last_name || '',
          email: user.email || '',
          phone: user.phone || '',
          branch: user.hotel?.hotel_name || 'N/A',
          role: user.role?.role_name?.replace(/_/g, ' ') || 'N/A',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };
        
        setFormData(userData);
        setOriginalData(userData);
        
        // Set profile image if available
        if (user.profile_picture_url) {
          setProfileImage(user.profile_picture_url);
        } else {
          setProfileImage('https://via.placeholder.com/150');
        }
      } else {
        toast.error(result.message || 'Failed to fetch profile data');
        // If unauthorized, redirect to login
        if (response.status === 401 || response.status === 403) {
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    // Clear cookie by calling logout endpoint if you have one
    window.location.href = '/login';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('http://localhost:5000/api/users/profile/picture', {
        method: 'DELETE',
        headers: headers,
        credentials: 'include'
      });

      const result = await response.json();

      if (result.success) {
        setProfileImage('https://via.placeholder.com/150');
        setShowCropper(false);
        toast.success('Profile picture removed successfully');
      } else {
        toast.error(result.message || 'Failed to remove profile picture');
      }
    } catch (error) {
      console.error('Error removing profile picture:', error);
      toast.error('Failed to remove profile picture');
    }
  };

  const handleApplyCrop = async () => {
    try {
      setShowCropper(false);
      
      const token = localStorage.getItem('token');
      
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Upload base64 image to Azure Blob Storage via backend
      const response = await fetch('http://localhost:5000/api/users/profile/picture', {
        method: 'PUT',
        headers: headers,
        credentials: 'include',
        body: JSON.stringify({
          profile_picture_base64: profileImage
        })
      });

      const result = await response.json();

      if (result.success) {
        // Update the profile image with the Azure URL
        setProfileImage(result.data.profile_picture_url);
        toast.success('Profile picture updated successfully');
      } else {
        toast.error(result.message || 'Failed to update profile picture');
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
      toast.error('Failed to update profile picture');
    }
  };

  const handleCancelCrop = () => {
    setShowCropper(false);
    setZoom(1.2);
    // Reset to original image
    if (originalData) {
      fetchUserProfile();
    }
  };

  const validateForm = () => {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    // Phone validation (optional field)
    if (formData.phone && formData.phone.length > 0) {
      const phoneRegex = /^[+]?[\d\s\-()]+$/;
      if (!phoneRegex.test(formData.phone)) {
        toast.error('Please enter a valid phone number');
        return false;
      }
    }

    // Password validation
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        toast.error('Please enter your current password');
        return false;
      }

      if (formData.newPassword.length < 8) {
        toast.error('New password must be at least 8 characters long');
        return false;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        toast.error('New passwords do not match');
        return false;
      }
    }

    return true;
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);
      const token = localStorage.getItem('token');

      // Prepare update data
      const updateData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone
      };

      // Add password fields if changing password
      if (formData.newPassword) {
        updateData.current_password = formData.currentPassword;
        updateData.new_password = formData.newPassword;
      }

      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: headers,
        credentials: 'include',
        body: JSON.stringify(updateData)
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Profile updated successfully');
        
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));

        // Refresh profile data
        await fetchUserProfile();
      } else {
        toast.error(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (originalData) {
      setFormData(originalData);
      toast.info('Changes discarded');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f5f7f8] dark:bg-[#0f1923]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5DADE2] mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#f5f7f8] dark:bg-[#0f1923] overflow-hidden">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

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
          <div className="max-w-4xl mx-auto">
            {/* Page Title */}
            <div className="mb-4 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl font-black leading-tight tracking-[-0.033em] text-[#111518] dark:text-white">
                Edit Your Profile
              </h1>
            </div>

            {/* Profile Card */}
            <form onSubmit={handleSaveChanges} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
              
              {/* Profile Picture Section */}
              <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-0.5">
                  Profile Picture
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Update your profile picture.
                </p>
                
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  {/* Profile Image Preview */}
                  <div 
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: `url("${profileImage}")` }}
                  />
                  
                  <div className="flex-grow w-full">
                    {/* Upload/Remove Buttons */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={handleUploadClick}
                        className="flex items-center justify-center rounded-lg px-3 h-9 text-sm font-semibold bg-[#5DADE2] text-white hover:bg-[#4A90C2] transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5 mr-1.5" />
                        Upload New
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="flex items-center justify-center rounded-lg px-3 h-9 text-sm font-semibold bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                      >
                        <X className="w-3.5 h-3.5 mr-1.5" />
                        Remove
                      </button>
                    </div>

                    {/* Image Cropper */}
                    {showCropper && (
                      <div className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-3">
                          Crop your new profile picture
                        </p>
                        <div className="flex flex-col lg:flex-row items-start gap-3">
                          {/* Crop Preview */}
                          <div className="relative w-40 h-40 sm:w-44 sm:h-44 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                            <img 
                              alt="Crop preview" 
                              className="w-full h-full object-cover"
                              style={{ transform: `scale(${zoom})` }}
                              src={profileImage}
                            />
                            <div className="absolute inset-0 bg-black/40"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 sm:w-32 sm:h-32 border-2 border-white rounded-full"></div>
                          </div>

                          {/* Crop Controls */}
                          <div className="flex flex-col gap-3">
                            <div>
                              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                                Zoom
                              </p>
                              <input
                                type="range"
                                min="1"
                                max="2"
                                step="0.01"
                                value={zoom}
                                onChange={(e) => setZoom(parseFloat(e.target.value))}
                                className="w-28 sm:w-32 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={handleCancelCrop}
                                className="px-3 py-1.5 text-xs sm:text-sm font-semibold bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={handleApplyCrop}
                                className="px-3 py-1.5 text-xs sm:text-sm font-semibold bg-[#5DADE2] text-white rounded-lg hover:bg-[#4A90C2] transition-colors"
                              >
                                Apply
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Information Section */}
              <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <label className="flex flex-col">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                      First Name
                    </p>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full h-9 sm:h-10 px-3 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0D2C54]/50"
                    />
                  </label>

                  <label className="flex flex-col">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                      Last Name
                    </p>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full h-9 sm:h-10 px-3 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0D2C54]/50"
                    />
                  </label>

                  <label className="flex flex-col md:col-span-2">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                      Email Address
                    </p>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full h-9 sm:h-10 px-3 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0D2C54]/50"
                    />
                  </label>

                  <label className="flex flex-col md:col-span-2">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                      Phone Number
                    </p>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full h-9 sm:h-10 px-3 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0D2C54]/50"
                    />
                  </label>
                </div>
              </div>

              {/* Account Details Section */}
              <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Account Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <label className="flex flex-col">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                      Assigned Branch
                    </p>
                    <input
                      type="text"
                      value={formData.branch}
                      disabled
                      className="w-full h-9 sm:h-10 px-3 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                    />
                  </label>

                  <label className="flex flex-col">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                      Role
                    </p>
                    <input
                      type="text"
                      value={formData.role}
                      disabled
                      className="w-full h-9 sm:h-10 px-3 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                    />
                  </label>
                </div>
              </div>

              {/* Change Password Section */}
              <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Change Password
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:gap-4">
                  <label className="flex flex-col">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                      Current Password
                    </p>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      placeholder="Enter your current password"
                      className="w-full h-9 sm:h-10 px-3 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D2C54]/50"
                    />
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <label className="flex flex-col">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                        New Password
                      </p>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        placeholder="Enter new password"
                        className="w-full h-9 sm:h-10 px-3 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D2C54]/50"
                      />
                    </label>

                    <label className="flex flex-col">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-1.5">
                        Confirm New Password
                      </p>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm new password"
                        className="w-full h-9 sm:h-10 px-3 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0D2C54]/50"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 p-4 sm:p-5 bg-gray-50 dark:bg-gray-900/50 rounded-b-xl">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="w-full sm:w-auto px-4 sm:px-5 h-9 sm:h-10 text-sm font-semibold bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full sm:w-auto px-4 sm:px-5 h-9 sm:h-10 text-sm font-semibold bg-[#5DADE2] text-white rounded-lg hover:bg-[#4A90C2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditProfile;