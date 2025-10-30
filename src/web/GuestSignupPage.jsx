import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, ArrowLeft } from 'lucide-react';
import morenalogo from '../assets/new_logo.png';

const base_url = "https://morena-backend-bwgjajcqd3eybuah.eastus-01.azurewebsites.net";



const GuestSignupPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [step, setStep] = useState('signup-step1'); // 'signup-step1', 'signup-step2', 'verification', 'success'
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    idType: '',
    idNumber: '',
    address: '',
    dateOfBirth: '',
    nationality: ''
  });

  const carouselImages = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAfFWICkJum3V7TkUs8Ht_DdEOQlZ5oav7NDfHBVoTudQHN3H-PG46MQgAuuJvqRx_fYI5NhvgaQK1X0hNO-08lLH7O3zTDgmZHg9K5y32E6-RAWj9jKktmFZHwyWp5wI_sR3gjPXIexXh-sG5cgsz0FTedVTH_mAWpXpbAiUNaxqOxgpqqUgFujSofgNCkI6g1fzxJ_l1ecwG3CEex20Jq7MurI4QhYChwp1DqmFFyJ1joamGpVdxIuynSl826NhHVkYGmS07Ysg",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBL8W66YiGhsBSZorGbNvIKzBCN73YkkpdHOeU8ePkuStNyTD25b3gOEMAKFzYuC8dH148kGDUjZzuO1BKx0kYsio5HrAaxHpeoJEr6rzwlEGuPs_Ju6UXRhCAF60z6yVrE0PL7X8iRtYQVotEPU1JCzOBIl79h5VDnNbQPPWbnq4v2D7ePogkslufpzeT5tsrAm1TnHKeJNafUzptkXPoj7-0N9bJMsEnsAOhVo_YYUSg4SBsD6NKIuWuQ-st_pl5ZNTucMg8WTw",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDiEeLU7Qr45HnVHHxt0ZsHmWPL1BvyEktxnfnZfXWY4x3BN0raQZ9fnVa_NYZIdQjDP7_QxoG3cmPpGDDIXNhG7ihfWVs2sTvhcVHnmtGQoPHQyrcAQAtEYW7mYbxSFionI_P7L5RmDb8F3TUHqh4xeoEmyo4Bqfl8st1gVLRG2ePq4zNXgIRdvcgP72A6pt5ekFMmNxwlcNP-GvnFHWoddtIk2A5d5oGHyIzSOTBvBLPtJVuJYT9LbGZKVRfNiBpNd8t50yeRnQ"
  ];

  useEffect(() => {
    const t = setInterval(() => setCurrentSlide(p => (p + 1) % 3), 5000);
    return () => clearInterval(t);
  }, []);

  const handleStep1Continue = (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    setStep('signup-step2');
  };

const handleSignup = async (e) => {
  e.preventDefault();
  setError('');

  // Validate required fields
  if (
    !formData.idType ||
    !formData.idNumber ||
    !formData.address ||
    !formData.dateOfBirth ||
    !formData.nationality
  ) {
    setError('Please fill in all required fields');
    return;
  }

  setIsLoading(true);

  try {
    // Send POST request using Axios
    const response = await axios.post(`${base_url}/api/auth/signup`, {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      idType: formData.idType,
      idNumber: formData.idNumber,
      address: formData.address,
      dateOfBirth: formData.dateOfBirth,
      nationality: formData.nationality,
    });

    // Handle successful signup
    if (response.status === 200 || response.status === 201) {
      setStep('verification');
    } else {
      throw new Error(response.data?.message || 'Signup failed');
    }
  } catch (err) {
    // Handle error response gracefully
    if (err.response) {
      // Server responded with an error status
      setError(err.response.data?.error || err.response.data?.message || 'Signup failed. Please try again.');
    } else if (err.request) {
      // Request was made but no response
      setError('No response from server. Please check your connection.');
    } else {
      // Other errors
      setError(err.message || 'An unexpected error occurred.');
    }
  } finally {
    setIsLoading(false);
  }
};


const handleVerify = async (e) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    // Send POST request using Axios
    const response = await axios.post(`${base_url}/api/auth/verify-email`, {
      email: formData.email,
      code: verificationCode,
    });

    // Check for successful verification
    if (response.status === 200 || response.status === 201) {
      setStep('success');
    } else {
      throw new Error(response.data?.message || 'Invalid code');
    }

  } catch (err) {
    // Handle all possible error cases
    if (err.response) {
      // Server responded with an error status (4xx or 5xx)
      setError(err.response.data?.error || err.response.data?.message || 'Signup failed. Please try again.');
    } else if (err.request) {
      // Request was made but no response from server
      setError('No response from server. Please check your internet connection.');
    } else {
      // Other unexpected errors
      setError(err.message || 'An unexpected error occurred.');
    }
  } finally {
    setIsLoading(false);
  }
};

const handleResend = async () => {
  setError('');
  setIsLoading(true);

  try {
    // Send resend verification request
    const response = await axios.post(
      `${base_url}/api/auth/resend-verification`,
      { email: formData.email },
      { headers: { 'Content-Type': 'application/json' } }
    );

    // Handle success (status 200 or 201)
    if (response.status === 200 || response.status === 201) {
      setVerificationCode('');
      alert('Verification code has been resent to your email!');
    } else {
      throw new Error('Failed to resend verification code.');
    }

  } catch (err) {
    console.error('Error during resend:', err);

    // Extract structured error message from backend
    if (err.response) {
      const backendError = err.response.data;

      const errorText =
        backendError.error ||
        backendError.message ||
        'Failed to resend verification code.';
      const detailsText = backendError.details
        ? backendError.details.join(', ')
        : '';

      setError(detailsText ? `${errorText}: ${detailsText}` : errorText);

    } else if (err.request) {
      setError('No response from server. Please check your connection.');
    } else {
      setError(err.message || 'Unexpected error occurred during resend.');
    }

  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#f5f7f8] dark:bg-[#111518] flex flex-col">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Manrope:wght@200;300;400;500;600;700;800&display=swap');`}</style>
      
      <header className="px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <img src={morenalogo} alt="Morena Hotels Logo" className="w-10 h-10 object-contain" />
          <h2 className="text-xl font-bold text-[#003366] dark:text-white" style={{fontFamily: 'Playfair Display, serif'}}>Morena Hotels</h2>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="h-64 md:h-full min-h-[400px] rounded-lg overflow-hidden relative">
            {carouselImages.map((img, i) => (
              <div key={i} className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${i === currentSlide ? 'opacity-100' : 'opacity-0'}`} style={{backgroundImage: `url(${img})`}} />
            ))}
          </div>

          <div className="bg-white dark:bg-[#1b2227] rounded-lg shadow-lg p-6 sm:p-8">
            {step === 'signup-step1' && (
              <div>
                <h1 className="text-2xl font-bold text-black dark:text-white mb-1">Create Account</h1>
                <p className="text-sm text-black/60 dark:text-white/60 mb-1">Join us for exclusive benefits</p>
                <p className="text-xs text-black/40 dark:text-white/40 mb-4">Step 1 of 2: Basic Information</p>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-sm font-medium text-black dark:text-white block mb-1">First Name</label>
                      <input type="text" name="firstName" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#111518] text-black dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="John" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-black dark:text-white block mb-1">Last Name</label>
                      <input type="text" name="lastName" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#111518] text-black dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Doe" required />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-black dark:text-white block mb-1">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#111518] text-black dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="john@example.com" required />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-black dark:text-white block mb-1">Phone</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#111518] text-black dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+94 71 234 5678" required />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-black dark:text-white block mb-1">Password</label>
                    <input type="password" name="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#111518] text-black dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Min 8 characters" required />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-black dark:text-white block mb-1">Confirm Password</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#111518] text-black dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Re-enter password" required />
                  </div>
                  
                  {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded p-2 text-xs text-red-600 dark:text-red-400">{error}</div>}
                  
                  <button onClick={handleStep1Continue} className="w-full h-10 bg-[#0d93f2] hover:bg-[#0b7ed1] text-white font-semibold rounded-md transition">Continue to Step 2</button>
                  
                  <p className="text-xs text-center text-black/60 dark:text-white/60">Already have an account? <a href="/guest-login" className="text-[#0d93f2] font-medium">Log In</a></p>
                </div>
              </div>
            )}

            {step === 'signup-step2' && (
              <div>
                <button onClick={() => setStep('signup-step1')} className="flex items-center gap-1 text-sm text-black/60 dark:text-white/60 hover:text-[#0d93f2] mb-3">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                
                <h1 className="text-2xl font-bold text-black dark:text-white mb-1">Personal Details</h1>
                <p className="text-sm text-black/60 dark:text-white/60 mb-1">Complete your profile</p>
                <p className="text-xs text-black/40 dark:text-white/40 mb-4">Step 2 of 2: Identification & Address</p>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-sm font-medium text-black dark:text-white block mb-1">ID Type</label>
                      <select name="idType" value={formData.idType} onChange={(e) => setFormData({...formData, idType: e.target.value})} className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#111518] text-black dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none" required>
                        <option value="">Select...</option>
                        <option value="passport">Passport</option>
                        <option value="national_id">National ID</option>
                        <option value="driving_license">Driving License</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-black dark:text-white block mb-1">ID Number</label>
                      <input type="text" name="idNumber" value={formData.idNumber} onChange={(e) => setFormData({...formData, idNumber: e.target.value})} className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#111518] text-black dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="ID number" required />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-black dark:text-white block mb-1">Address</label>
                    <textarea name="address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full h-20 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#111518] text-black dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Street address, City, Postal Code" required />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-black dark:text-white block mb-1">Date of Birth</label>
                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})} className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#111518] text-black dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none" required />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-black dark:text-white block mb-1">Nationality</label>
                    <input type="text" name="nationality" value={formData.nationality} onChange={(e) => setFormData({...formData, nationality: e.target.value})} className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#111518] text-black dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g., Sri Lankan" required />
                  </div>
                  
                  {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded p-2 text-xs text-red-600 dark:text-red-400">{error}</div>}
                  
                  <label className="flex gap-2 items-start text-xs text-black/60 dark:text-white/60">
                    <input type="checkbox" required className="mt-0.5" />
                    <span>I agree to <a href="#" className="text-blue-500">Terms</a> and <a href="#" className="text-blue-500">Privacy</a></span>
                  </label>
                  
                  <button onClick={handleSignup} disabled={isLoading} className="w-full h-10 bg-[#0d93f2] hover:bg-[#0b7ed1] text-white font-semibold rounded-md transition disabled:opacity-50">{isLoading ? 'Creating...' : 'Create Account'}</button>
                </div>
              </div>
            )}

            {step === 'verification' && (
              <div>
                <h1 className="text-2xl font-bold text-black dark:text-white mb-2">Verify Your Email</h1>
                <p className="text-sm text-black/60 dark:text-white/60 mb-1">We've sent a code to</p>
                <p className="text-sm font-medium text-black dark:text-white mb-6">{formData.email}</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-black dark:text-white block mb-2">Enter 6-Digit Code</label>
                    <input type="text" value={verificationCode} onChange={(e) => {const v = e.target.value.replace(/\D/g, ''); if(v.length <= 6) {setVerificationCode(v); setError('');}}} maxLength={6} className="w-full h-16 px-4 rounded-md border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#111518] text-black dark:text-white text-2xl text-center font-bold tracking-widest focus:ring-2 focus:ring-blue-500 outline-none" placeholder="000000" required />
                  </div>
                  
                  {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded p-3 text-xs text-center font-medium text-red-600 dark:text-red-400">{error}</div>}
                  
                  <button onClick={handleVerify} disabled={isLoading || verificationCode.length !== 6} className="w-full h-11 bg-[#0d93f2] hover:bg-[#0b7ed1] text-white font-semibold rounded-md transition disabled:opacity-50">{isLoading ? 'Verifying...' : 'Verify Code'}</button>
                  
                  <div className="text-center">
                    <p className="text-xs text-black/60 dark:text-white/60 mb-2">Didn't receive the code?</p>
                    <button onClick={handleResend} disabled={isLoading} className="text-xs font-semibold text-[#0d93f2] hover:underline disabled:opacity-50">Resend Code</button>
                  </div>
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="flex flex-col items-center gap-6 py-8">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <Check className="w-10 h-10 text-green-600 dark:text-green-400" strokeWidth={3} />
                </div>
                <div className="text-center space-y-2">
                  <h1 className="text-2xl font-bold text-black dark:text-white">Account Created!</h1>
                  <p className="text-sm text-black/60 dark:text-white/60">Welcome to Morena Hotels, {formData.firstName}!</p>
                  <p className="text-sm text-black/60 dark:text-white/60">Your account is verified and ready.</p>
                </div>
                <a href="/guest-login" className="w-full h-11 bg-[#0d93f2] hover:bg-[#0b7ed1] text-white font-semibold rounded-md flex items-center justify-center transition">Go to Login</a>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-black/60 dark:text-white/60">© 2025 Morena Hotels. All rights reserved.</p>
          <div className="flex gap-4 text-xs">
            <a href="#" className="text-black/60 dark:text-white/60 hover:text-[#0d93f2]">Privacy</a>
            <a href="#" className="text-black/60 dark:text-white/60 hover:text-[#0d93f2]">Terms</a>
            <a href="#" className="text-black/60 dark:text-white/60 hover:text-[#0d93f2]">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GuestSignupPage;
