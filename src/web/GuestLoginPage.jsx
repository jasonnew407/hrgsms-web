import React, { useState, useEffect } from 'react';
import axios from 'axios';
import morenalogo from '../assets/new_logo.png';

const base_url = "https://morena-backend-g4h6fzg3g7bkdshk.eastasia-01.azurewebsites.net";


const GuestLoginPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentView, setCurrentView] = useState('login'); // 'login', 'forgotPassword', 'verifyCode', 'resetPassword', 'success'
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [loading, setIsLoading] = useState(false);

  // Placeholder logo (you'll need to replace this with your actual logo)

  const carouselImages = [
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAfFWICkJum3V7TkUs8Ht_DdEOQlZ5oav7NDfHBVoTudQHN3H-PG46MQgAuuJvqRx_fYI5NhvgaQK1X0hNO-08lLH7O3zTDgmZHg9K5y32E6-RAWj9jKktmFZHwyWp5wI_sR3gjPXIexXh-sG5cgsz0FTedVTH_mAWpXpbAiUNaxqOxgpqqUgFujSofgNCkI6g1fzxJ_l1ecwG3CEex20Jq7MurI4QhYChwp1DqmFFyJ1joamGpVdxIuynSl826NhHVkYGmS07Ysg",
      alt: "Guest relaxing by the pool at Morena Hotels."
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBL8W66YiGhsBSZorGbNvIKzBCN73YkkpdHOeU8ePkuStNyTD25b3gOEMAKFzYuC8dH148kGDUjZzuO1BKx0kYsio5HrAaxHpeoJEr6rzwlEGuPs_Ju6UXRhCAF60z6yVrE0PL7X8iRtYQVotEPU1JCzOBIl79h5VDnNbQPPWbnq4v2D7ePogkslufpzeT5tsrAm1TnHKeJNafUzptkXPoj7-0N9bJMsEnsAOhVo_YYUSg4SBsD6NKIuWuQ-st_pl5ZNTucMg8WTw",
      alt: "Couple enjoying a meal at a beachfront restaurant at Morena Hotels."
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDiEeLU7Qr45HnVHHxt0ZsHmWPL1BvyEktxnfnZfXWY4x3BN0raQZ9fnVa_NYZIdQjDP7_QxoG3cmPpGDDIXNhG7ihfWVs2sTvhcVHnmtGQoPHQyrcAQAtEYW7mYbxSFionI_P7L5RmDb8F3TUHqh4xeoEmyo4Bqfl8st1gVLRG2ePq4zNXgIRdvcgP72A6pt5ekFMmNxwlcNP-GvnFHWoddtIk2A5d5oGHyIzSOTBvBLPtJVuJYT9LbGZKVRfNiBpNd8t50yeRnQ",
      alt: "A serene view of the ocean from a hotel balcony at Morena Hotels."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [carouselImages.length]);

const handleLogin = async (e) => {
  e.preventDefault();
  setErrorMessage('');
  setIsLoading(true);

  try {
    // Send login request
    const res = await axios.post(
      `${base_url}/api/auth/signin`,
      { email, password },
      { headers: { 'Content-Type': 'application/json' } }
    );

    // Handle successful response
    if (res.status === 200 || res.status === 201) {
      console.log('Login successful:', res.data);
      setIsLoading(false);
      // Redirect after login
      window.location.href = '/management';
    } else {
      setErrorMessage('Login failed. Please check your credentials.');
    }
  } catch (err) {
    console.error('Error during login:', err);

    // Extract error information from backend response
    if (err.response) {
      const backendError = err.response.data;

      // Combine main message + any Sequelize validation details
      const errorText = backendError.error || backendError.message || 'Login failed. Please try again.';
      const detailsText = backendError.details ? backendError.details.join(', ') : '';

      setErrorMessage(detailsText ? `${errorText}: ${detailsText}` : errorText);
    } else if (err.request) {
      // Request was made but no response received
      setErrorMessage('No response from server. Please check your connection.');
    } else {
      // Other unexpected errors
      setErrorMessage(err.message || 'Unexpected error occurred during login.');
    }
  } finally {
    setIsLoading(false);
  }
};

const handleForgotPasswordSubmit = async (e) => {
  e.preventDefault();
  setErrorMessage('');
  setIsLoading(true);

  try {
    const res = await axios.post(
      `${base_url}/api/auth/forgot-password`, // corrected endpoint naming convention
      { email },
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (res.status === 200 || res.status === 201) {
      console.log('Verification email sent');
      setCurrentView('verifyCode');
    } else {
      setErrorMessage('Failed to send verification email. Please try again.');
    }

  } catch (err) {
    console.error('Error sending verification email:', err);

    if (err.response) {
      const backendError = err.response.data;
      const errorText =
        backendError.error ||
        backendError.message ||
        'Failed to send verification email.';
      const detailsText = backendError.details
        ? backendError.details.join(', ')
        : '';
      setErrorMessage(detailsText ? `${errorText}: ${detailsText}` : errorText);
    } else if (err.request) {
      setErrorMessage('No response from server. Please check your connection.');
    } else {
      setErrorMessage(err.message || 'Unexpected error occurred.');
    }
  } finally {
    setIsLoading(false);
  }
};
  const handleVerifyCode = async (e) => {
  e.preventDefault();
  setErrorMessage('');
  setIsLoading(true);

  try {
    const res = await axios.post(
      `${base_url}/api/auth/verify-email`,
      { email, code: verificationCode },
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (res.status === 200 || res.status === 201) {
      console.log('Code verified');
      setCurrentView('resetPassword');
    } else {
      setErrorMessage('Invalid verification code. Please try again.');
    }

  } catch (err) {
    console.error('Error verifying code:', err);

    if (err.response) {
      const backendError = err.response.data;
      const errorText =
        backendError.error ||
        backendError.message ||
        'Invalid verification code.';
      const detailsText = backendError.details
        ? backendError.details.join(', ')
        : '';
      setErrorMessage(detailsText ? `${errorText}: ${detailsText}` : errorText);
    } else if (err.request) {
      setErrorMessage('No response from server. Please check your connection.');
    } else {
      setErrorMessage(err.message || 'Unexpected error occurred.');
    }
  } finally {
    setIsLoading(false);
  }
};


 const handleResetPassword = async (e) => {
  e.preventDefault();
  setErrorMessage('');
  setIsLoading(true);

  // Client-side validation
  if (newPassword !== confirmPassword) {
    setErrorMessage('Passwords do not match.');
    setIsLoading(false);
    return;
  }

  if (newPassword.length < 8) {
    setErrorMessage('Password must be at least 8 characters long.');
    setIsLoading(false);
    return;
  }

  try {
    const res = await axios.post(
      `${base_url}/api/auth/reset-password`,
      { email, code: verificationCode, newPassword },
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (res.status === 200 || res.status === 201) {
      console.log('Password reset successful');
      setCurrentView('success');
    } else {
      setErrorMessage('Failed to reset password. Please try again.');
    }

  } catch (err) {
    console.error('Error resetting password:', err);

    if (err.response) {
      const backendError = err.response.data;
      const errorText =
        backendError.error ||
        backendError.message ||
        'Failed to reset password.';
      const detailsText = backendError.details
        ? backendError.details.join(', ')
        : '';
      setErrorMessage(detailsText ? `${errorText}: ${detailsText}` : errorText);
    } else if (err.request) {
      setErrorMessage('No response from server. Please check your connection.');
    } else {
      setErrorMessage(err.message || 'Unexpected error occurred.');
    }
  } finally {
    setIsLoading(false);
  }
};


const resetToLogin = () => {
    setCurrentView('login');
    setEmail('');
    setPassword('');
    setVerificationCode('');
    setNewPassword('');
    setConfirmPassword('');
    setErrorMessage('');
  };

  const renderFormContent = () => {
    switch (currentView) {
      case 'login':
        return (
          <>
            <div className="flex flex-col gap-1 mb-4">
              <h1 className="text-black dark:text-white text-xl sm:text-2xl font-bold leading-tight">
                Welcome Back
              </h1>
              <p className="text-black/60 dark:text-white/60 text-xs sm:text-sm">
                Login to manage your stay
              </p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-3">
              {errorMessage && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                  <p className="text-red-600 dark:text-red-400 text-xs">{errorMessage}</p>
                </div>
              )}

              <label className="flex flex-col w-full">
                <p className="text-black dark:text-white text-xs sm:text-sm font-medium pb-1">
                  Email
                </p>
                <input
                  type="email"
                  className="flex w-full rounded-md text-black dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#0d93f2]/50 border border-[#3b4a54]/20 dark:border-[#3b4a54] bg-[#f9fafb] dark:bg-[#111518] h-9 sm:h-10 placeholder:text-black/40 dark:placeholder:text-white/40 px-3 text-xs sm:text-sm"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              <label className="flex flex-col w-full">
                <p className="text-black dark:text-white text-xs sm:text-sm font-medium pb-1">
                  Password
                </p>
                <input
                  type="password"
                  className="flex w-full rounded-md text-black dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#0d93f2]/50 border border-[#3b4a54]/20 dark:border-[#3b4a54] bg-[#f9fafb] dark:bg-[#111518] h-9 sm:h-10 placeholder:text-black/40 dark:placeholder:text-white/40 px-3 text-xs sm:text-sm"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>

              <button
                type="submit"
                className="flex w-full mt-2 cursor-pointer items-center justify-center rounded-md h-9 sm:h-10 px-4 bg-[#0d93f2] text-white text-xs sm:text-sm font-semibold hover:bg-[#0d93f2]/90 transition-colors"
              >
                <span className="truncate">Log In</span>
              </button>

              <div className="flex flex-col sm:flex-row items-center justify-between mt-2 gap-2">
                <button
                  type="button"
                  onClick={() => [setCurrentView('forgotPassword'), setErrorMessage('')]}
                  className="text-[#0d93f2] text-xs font-medium hover:underline"
                >
                  Forgot Password?
                </button>
                <p className="text-black/60 dark:text-white/60 text-xs text-center sm:text-left">
                  Don't have an account?{' '}
                  <a href="/guest-signup" className="text-[#0d93f2] font-medium hover:underline">
                    Sign Up
                  </a>
                </p>
              </div>
            </form>
          </>
        );

      case 'forgotPassword':
        return (
          <>
            <div className="flex flex-col gap-1 mb-4">
              <h1 className="text-black dark:text-white text-xl sm:text-2xl font-bold leading-tight">
                Forgot Password
              </h1>
              <p className="text-black/60 dark:text-white/60 text-xs sm:text-sm">
                Enter your email to receive a verification code
              </p>
            </div>

            <form onSubmit={handleForgotPasswordSubmit} className="flex flex-col gap-3">
              {errorMessage && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                  <p className="text-red-600 dark:text-red-400 text-xs">{errorMessage}</p>
                </div>
              )}

              <label className="flex flex-col w-full">
                <p className="text-black dark:text-white text-xs sm:text-sm font-medium pb-1">
                  Email
                </p>
                <input
                  type="email"
                  className="flex w-full rounded-md text-black dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#0d93f2]/50 border border-[#3b4a54]/20 dark:border-[#3b4a54] bg-[#f9fafb] dark:bg-[#111518] h-9 sm:h-10 placeholder:text-black/40 dark:placeholder:text-white/40 px-3 text-xs sm:text-sm"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              <button
                type="submit"
                className="flex w-full mt-2 cursor-pointer items-center justify-center rounded-md h-9 sm:h-10 px-4 bg-[#0d93f2] text-white text-xs sm:text-sm font-semibold hover:bg-[#0d93f2]/90 transition-colors"
              >
                <span className="truncate">Send Verification Code</span>
              </button>

              <button
                type="button"
                onClick={resetToLogin}
                loading={loading}
                className="text-[#0d93f2] text-xs font-medium hover:underline mt-2"
              >
                Back to Login
              </button>
            </form>
          </>
        );

      case 'verifyCode':
        return (
          <>
            <div className="flex flex-col gap-1 mb-4">
              <h1 className="text-black dark:text-white text-xl sm:text-2xl font-bold leading-tight">
                Verify Code
              </h1>
              <p className="text-black/60 dark:text-white/60 text-xs sm:text-sm">
                Enter the verification code sent to {email}
              </p>
            </div>

            <form onSubmit={handleVerifyCode} className="flex flex-col gap-3">
              {errorMessage && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                  <p className="text-red-600 dark:text-red-400 text-xs">{errorMessage}</p>
                </div>
              )}

              <label className="flex flex-col w-full">
                <p className="text-black dark:text-white text-xs sm:text-sm font-medium pb-1">
                  Verification Code
                </p>
                <input
                  type="text"
                  className="flex w-full rounded-md text-black dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#0d93f2]/50 border border-[#3b4a54]/20 dark:border-[#3b4a54] bg-[#f9fafb] dark:bg-[#111518] h-9 sm:h-10 placeholder:text-black/40 dark:placeholder:text-white/40 px-3 text-xs sm:text-sm"
                  placeholder="Enter verification code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
              </label>

              <button
                type="submit"
                className="flex w-full mt-2 cursor-pointer items-center justify-center rounded-md h-9 sm:h-10 px-4 bg-[#0d93f2] text-white text-xs sm:text-sm font-semibold hover:bg-[#0d93f2]/90 transition-colors"
              >
                <span className="truncate">Verify Code</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentView('forgotPassword')}
                className="text-[#0d93f2] text-xs font-medium hover:underline mt-2"
              >
                Resend Code
              </button>
            </form>
          </>
        );

      case 'resetPassword':
        return (
          <>
            <div className="flex flex-col gap-1 mb-4">
              <h1 className="text-black dark:text-white text-xl sm:text-2xl font-bold leading-tight">
                Reset Password
              </h1>
              <p className="text-black/60 dark:text-white/60 text-xs sm:text-sm">
                Enter your new password
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="flex flex-col gap-3">
              {errorMessage && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                  <p className="text-red-600 dark:text-red-400 text-xs">{errorMessage}</p>
                </div>
              )}

              <label className="flex flex-col w-full">
                <p className="text-black dark:text-white text-xs sm:text-sm font-medium pb-1">
                  New Password
                </p>
                <input
                  type="password"
                  className="flex w-full rounded-md text-black dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#0d93f2]/50 border border-[#3b4a54]/20 dark:border-[#3b4a54] bg-[#f9fafb] dark:bg-[#111518] h-9 sm:h-10 placeholder:text-black/40 dark:placeholder:text-white/40 px-3 text-xs sm:text-sm"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </label>

              <label className="flex flex-col w-full">
                <p className="text-black dark:text-white text-xs sm:text-sm font-medium pb-1">
                  Confirm Password
                </p>
                <input
                  type="password"
                  className="flex w-full rounded-md text-black dark:text-white focus:outline-0 focus:ring-2 focus:ring-[#0d93f2]/50 border border-[#3b4a54]/20 dark:border-[#3b4a54] bg-[#f9fafb] dark:bg-[#111518] h-9 sm:h-10 placeholder:text-black/40 dark:placeholder:text-white/40 px-3 text-xs sm:text-sm"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </label>

              <button
                type="submit"
                className="flex w-full mt-2 cursor-pointer items-center justify-center rounded-md h-9 sm:h-10 px-4 bg-[#0d93f2] text-white text-xs sm:text-sm font-semibold hover:bg-[#0d93f2]/90 transition-colors"
              >
                <span className="truncate">Reset Password</span>
              </button>
            </form>
          </>
        );

      case 'success':
        return (
          <>
            <div className="flex flex-col items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-black dark:text-white text-xl sm:text-2xl font-bold leading-tight text-center">
                Password Reset Successful!
              </h1>
              <p className="text-black/60 dark:text-white/60 text-xs sm:text-sm text-center">
                Your password has been successfully reset. You can now log in with your new password.
              </p>
            </div>

            <button
              type="button"
              onClick={resetToLogin}
              className="flex w-full cursor-pointer items-center justify-center rounded-md h-9 sm:h-10 px-4 bg-[#0d93f2] text-white text-xs sm:text-sm font-semibold hover:bg-[#0d93f2]/90 transition-colors"
            >
              <span className="truncate">Back to Login</span>
            </button>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f5f7f8] dark:bg-[#111518] font-['Manrope',sans-serif]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Manrope:wght@200;300;400;500;600;700;800&display=swap');
        body {
          font-family: 'Manrope', sans-serif;
        }
        .font-display { 
          font-family: 'Playfair Display', serif; 
        }
      `}</style>
      
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="w-full px-4 sm:px-8 md:px-16 lg:px-24 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <a className="flex items-center gap-3 text-[#003366] dark:text-white" href="#">
              <img 
                src={morenalogo}
                alt="Morena Hotels Logo" 
                className="w-9 h-9 object-contain"
              />
              <h2 className="text-xl font-bold tracking-tight font-display">Morena Hotels</h2>
            </a>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center py-4 sm:py-6 px-4">
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-center">
            
            {/* Carousel Section */}
            <div className="h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] overflow-hidden rounded-lg">
              <div className="relative w-full h-full">
                {carouselImages.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 w-full h-full bg-center bg-no-repeat bg-cover transition-opacity duration-1000 ${
                      index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ backgroundImage: `url("${image.url}")` }}
                    role="img"
                    aria-label={image.alt}
                  />
                ))}
              </div>
            </div>

            {/* Form Section */}
            <div className="flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-white dark:bg-[#1b2227] rounded-lg shadow-lg">
              {renderFormContent()}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-solid border-t-[#3b4a54]/20 dark:border-t-[#3b4a54] px-4 sm:px-8 py-4">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="text-center md:text-left">
              <p className="text-black/60 dark:text-white/60 text-xs">
                © 2025 Morena Hotels. All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="text-black/60 dark:text-white/60 hover:text-[#0d93f2] transition-colors" aria-label="Threads">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
                  <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z"/>
                </svg>
              </a>
              
              <a href="#" className="text-black/60 dark:text-white/60 hover:text-[#0d93f2] transition-colors" aria-label="Facebook">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19,3H5C3.89,3 3,3.89 3,5V19C3,20.11 3.9,21 5,21H19C20.11,21 21,20.11 21,19V5C21,3.89 20.11,3 19,3M19,5V19H14.75V13.34H16.5L16.83,11.33H14.75V10.03C14.75,9.44 14.92,9.03 15.81,9.03H16.9V7.17C16.72,7.14 15.96,7.07 15.13,7.07C13.4,7.07 12.25,8.12 12.25,9.85V11.33H10.5V13.34H12.25V19H5V5H19Z" />
                </svg>
              </a>
              
              <a href="#" className="text-black/60 dark:text-white/60 hover:text-[#0d93f2] transition-colors" aria-label="Instagram">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" />
                </svg>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default GuestLoginPage;
