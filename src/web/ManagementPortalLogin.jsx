import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import morenaLogo from '../assets/new_logo.png';

const ManagementPortalLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/auth/signin', {
                email,
                password
            }, {
                withCredentials: true
            });

            if (response.data && response.data.user) {
                const userData = response.data.user;
                
                // Store user data in localStorage
                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('isAuthenticated', 'true');
                
                // Get user role and convert to lowercase for comparison
                const userRole = userData.role?.toLowerCase() || '';
                
                // Role-based redirection
                if (userRole === 'admin' || userRole === 'administrator' || userRole === 'system administrator') {
                    navigate('/adminDashboard');
                } else if (userRole === 'manager') {
                    navigate('/adminDashboard'); // You can change this to /managerDashboard if you have one
                } else if (userRole === 'staff') {
                    navigate('/adminDashboard'); // You can change this to /staffDashboard if you have one
                } else {
                    // Default fallback for any other role
                    navigate('/adminDashboard');
                }
            }
        } catch (err) {
            console.error('Login error:', err);
            
            // Handle different error types
            if (err.response?.status === 401) {
                setError('Invalid email or password');
            } else if (err.response?.status === 403) {
                setError(err.response?.data?.message || 'Your account is not active');
            } else if (err.response?.status === 500) {
                setError('Server error. Please try again later');
            } else {
                setError(err.response?.data?.message || 'Login failed. Please try again');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex flex-col bg-gray-200 dark:bg-gray-800">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Manrope:wght@200;300;400;500;600;700;800&display=swap');
                body {
                    font-family: 'Manrope', sans-serif;
                }
                .font-display { 
                    font-family: 'Playfair Display', serif; 
                }
            `}</style>
            
            <div className="relative flex flex-col h-full min-h-screen">
                {/* Header */}
                <header className="w-full px-4 sm:px-8 md:px-16 lg:px-24 py-4">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <a className="flex items-center gap-3 text-[#003366] dark:text-white" href="#">
                            <img 
                                src={morenaLogo}
                                alt="Morena Hotels Logo" 
                                className="w-9 h-9 object-contain"
                            />
                            <h2 className="text-xl font-bold tracking-tight font-display">Morena Hotels</h2>
                        </a>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-grow flex items-center justify-center p-4">
                    <div className="w-full max-w-xs mx-auto bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl p-5 space-y-4">
                        {/* Logo */}
                        <div className="flex justify-center">
                            <img 
                                src={morenaLogo}
                                alt="Morena Hotels Logo" 
                                className="w-20 h-20 object-contain"
                            />
                        </div>

                        {/* Title */}
                        <div className="text-center">
                            <p className="text-lg sm:text-xl font-black text-[#003366] dark:text-white tracking-tighter font-display">
                                WELCOME TO MORENA HOTELS
                            </p>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                MANAGEMENT PORTAL
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                                <p className="text-xs text-red-600 dark:text-red-400 text-center">{error}</p>
                            </div>
                        )}

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-3">
                            {/* Email Field */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="email">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-10 px-3 text-sm transition-colors"
                                    placeholder="Enter your email"
                                    required
                                    disabled={loading}
                                    autoComplete="email"
                                />
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="password">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-10 px-3 pr-10 text-sm transition-colors"
                                        placeholder="Enter your password"
                                        required
                                        disabled={loading}
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                        disabled={loading}
                                        tabIndex="-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {showPassword ? (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            ) : (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            )}
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Forgot Password Link */}
                            <div className="flex items-center justify-end">
                                <div className="text-xs">
                                    <a 
                                        className="font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors" 
                                        href="/forgot-password"
                                    >
                                        Forgot Password?
                                    </a>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            LOGGING IN...
                                        </>
                                    ) : (
                                        'LOGIN'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>

                {/* Footer */}
                <footer className="w-full px-4 sm:px-8 md:px-16 lg:px-24 py-4">
                    <div className="max-w-7xl mx-auto text-center text-gray-600 dark:text-gray-400 text-xs sm:text-sm space-y-1">
                        <p className="font-semibold">INTERNAL MANAGEMENT SYSTEM</p>
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
                            <p>© 2025 Morena Hotels. All Rights Reserved.</p>
                            <span className="hidden sm:inline text-gray-400 dark:text-gray-500">|</span>
                            <a 
                                className="hover:text-gray-800 dark:hover:text-white transition-colors" 
                                href="https://morenahotels.com"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                morenahotels.com
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default ManagementPortalLogin;
