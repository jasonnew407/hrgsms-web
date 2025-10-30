import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Plus, Minus, AlertCircle } from 'lucide-react';
import axios from 'axios';
import morenaLogo from '../assets/new_logo.png';

const BookingSearchPage = () => {
  const navigate = useNavigate();
  const [selectedBranch, setSelectedBranch] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const branches = ['Weligama', 'Midigama', 'Ahangama'];

  const carouselImages = [
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBQvOTIUM0oluE4TDUyapizUKzUHxBrFsVtmvnwYU-hAiUzzr6R3o5__z29RNCSX2dg0_sLGn5cowyqLTUYPJwpmsrRkA2lc2NHTWolttH0Wwbcg0otUfpR4slAp9vRaNDVdZQaR_qv-ITXzBXB1voOSK8nTo2RUfq6Oyc0bHwmvICDows__Q3ms_XLNWUNPTJLb5LG7xBOMxtgS7akvpfAcnl62MXhkaj-YR0hT8AW0QhomMr-T0vYssbSUiY93mBD-Mcw-xYHw",
      alt: "A sunny beach in Weligama with turquoise water and palm trees."
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQIGx0ReRtBKTIT4stjLXYPUtPjD30XuSBex1pkyALIzw-tQiebOLRq3JW8OYyTb-jbaav53FV5yQ29lJmOKz-1SYcHYKVO7FYuhxfM7zW42FaHT5J2e7tp4bIugZmbhkk_4KRkvnuFkp664nVpYbL6cB7r6C0wzySTRGV5BhnX85IX3lvOsvx8mxQ6A5JQRUFBxORymk7BgtA0DJ696AsSoSGyRe4bPFanNt-D0yBECwev_JoYdWZpvNkyWMKoX7IkpukNTRXMQ",
      alt: "Modern hotel room with a balcony view of the Midigama coast."
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDT16thzEN0sCHdZKA0gPJ-oHRv5fUbpNv6fYwbVJRwM7NIZvu-L4-VjhFUS80KP_a5bdRBOyTCkZ3qGPL1m_vdy4p2U9pRadU5s4wbdUuhFXZk0UyEvnGstabNXR6tHjxAt88YSIt7-_zfPM7ofXFAx-ZEv0WVioNyqCCaeWiYuhuZ1L_5gjLTnRmgMceZJASk8VRkfV0efq0SdVCt9x0jdPpKAubLV9Dc38WbORKLd3rlYc-cr3vTqn-kQMQhHOJT5Wogny71GQ",
      alt: "Surfers enjoying the waves at Ahangama beach."
    },
    {
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuANey0R-kZXXSA2rHE1xdbGxQbzFgx8MIXSI-LRMulDBKDOezn-Pdu0l7no-nGp5OQTjySrDwtL6GOxbfAdO3FaNGHStIDhjjCzlFQtL-XgmtRHuv1MHNc4ZDhKpi_tcnL4J1yBeyOmIFQl1U2bRavnp3YLZzWWp6hYT6oLMY3bmzQvWQYuVwvcpfpha-gt4qIRkKCE-Vs_gwRf03cKXdh0t0SV9H3BNLelkWzJYnXwSG7Mq1zSN4jn1bmvCD6K0p8XkSiay59Kmw",
      alt: "A luxurious hotel pool overlooking the ocean at sunset."
    }
  ];

  const getCurrentStep = () => {
    if (!selectedBranch) return 1;
    if (!checkIn || !checkOut) return 2;
    return 3;
  };

  const currentStep = getCurrentStep();

  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch);
    setError('');
  };

  const handleCheckAvailability = async () => {
    setError('');
    setIsLoading(true);

    try {
      const res = await axios.post('/api/booking/check-availability', {
        branch: selectedBranch,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        adults: adults,
        children: children
      }, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.status >= 200 && res.status < 300) {
        const data = res.data;
        console.log('Availability check successful', data);
        
        // Navigate to room selection page with data
        navigate('/room-selection', {
          state: {
            searchCriteria: data.data.searchCriteria,
            hotel: data.data.hotel,
            availableRooms: data.data.availableRooms,
            totalRoomsAvailable: data.data.totalRoomsAvailable
          }
        });
      } else {
        setError('Failed to check availability. Please try again.');
      }
    } catch (error) {
      console.error('Error checking availability:', error.response?.data || error.message || error);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.request) {
        setError('Unable to connect to server. Please check your connection.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isStep2Enabled = selectedBranch;
  const isStep3Enabled = checkIn && checkOut;
  const isFormComplete = selectedBranch && checkIn && checkOut;

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#f5f7f8] dark:bg-[#0f1923] font-['Manrope',sans-serif]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Manrope:wght@200;300;400;500;600;700;800&display=swap');
        body {
          font-family: 'Manrope', sans-serif;
        }
        .font-display { 
          font-family: 'Playfair Display', serif; 
        }
        @keyframes carousel {
          0%, 20% { transform: translateX(0); }
          25%, 45% { transform: translateX(-100%); }
          50%, 70% { transform: translateX(-200%); }
          75%, 95% { transform: translateX(-300%); }
          100% { transform: translateX(0); }
        }
        .animate-carousel {
          animation: carousel 16s ease-in-out infinite;
        }
      `}</style>

      {/* Header */}
      <header className="w-full px-4 sm:px-6 lg:px-8 py-2.5 bg-white dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a className="flex items-center gap-2 text-[#389cfa]" href="/">
            <img 
              src={morenaLogo}
              alt="Morena Hotels Logo" 
              className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
            />
            <h2 className="text-sm sm:text-base font-bold tracking-tight font-display text-[#003366]">
              Morena Hotels
            </h2>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 max-w-6xl mx-auto">
          
          {/* Carousel Section */}
          <div className="relative rounded-lg overflow-hidden h-[250px] sm:h-[350px] lg:h-[450px] flex items-center justify-center">
            <div className="absolute inset-0 w-full h-full">
              <div className="flex overflow-hidden h-full">
                <div className="flex items-stretch w-[400%] animate-carousel">
                  {carouselImages.map((image, index) => (
                    <div
                      key={index}
                      className="w-full h-full bg-center bg-no-repeat bg-cover"
                      style={{ backgroundImage: `url("${image.url}")` }}
                      role="img"
                      aria-label={image.alt}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="relative z-10 text-center px-4">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">
                Your Coastal Escape Awaits.
              </h1>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white dark:bg-gray-900/50 p-4 sm:p-5 rounded-lg shadow-lg flex flex-col space-y-4">
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-600 dark:text-red-400 text-xs">{error}</p>
              </div>
            )}

            {/* Progress Bar with Steps */}
            <div className="mb-1">
              <div className="flex items-center justify-between mb-3">
                {/* Step 1 */}
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    currentStep >= 1 
                      ? 'bg-[#389cfa] text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}>
                    1
                  </div>
                  <span className={`text-[10px] mt-1 font-medium ${
                    currentStep >= 1 
                      ? 'text-[#389cfa]' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    Branch
                  </span>
                </div>

                {/* Line 1-2 */}
                <div className={`flex-1 h-0.5 mx-1.5 transition-all ${
                  currentStep >= 2 
                    ? 'bg-[#389cfa]' 
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}></div>

                {/* Step 2 */}
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    currentStep >= 2 
                      ? 'bg-[#389cfa] text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}>
                    2
                  </div>
                  <span className={`text-[10px] mt-1 font-medium ${
                    currentStep >= 2 
                      ? 'text-[#389cfa]' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    Dates
                  </span>
                </div>

                {/* Line 2-3 */}
                <div className={`flex-1 h-0.5 mx-1.5 transition-all ${
                  currentStep >= 3 
                    ? 'bg-[#389cfa]' 
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}></div>

                {/* Step 3 */}
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    currentStep >= 3 
                      ? 'bg-[#389cfa] text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}>
                    3
                  </div>
                  <span className={`text-[10px] mt-1 font-medium ${
                    currentStep >= 3 
                      ? 'text-[#389cfa]' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    Guests
                  </span>
                </div>
              </div>
            </div>

            {/* Step 1: Choose Branch */}
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-2">
                Step 1: Choose Branch
              </h3>
              <div className="flex">
                <div className="flex h-9 flex-1 items-center justify-center rounded-lg bg-[#f5f7f8] dark:bg-gray-800 p-1 gap-1">
                  {branches.map((branch) => (
                    <label
                      key={branch}
                      className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 text-xs font-medium transition-all ${
                        selectedBranch === branch
                          ? 'bg-white dark:bg-gray-900 shadow-md text-[#389cfa]'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <span className="truncate">{branch}</span>
                      <input
                        type="radio"
                        name="branch"
                        value={branch}
                        checked={selectedBranch === branch}
                        onChange={() => handleBranchSelect(branch)}
                        className="sr-only"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 2: Check-in/out */}
            <div className={!isStep2Enabled ? 'opacity-50 pointer-events-none' : ''}>
              <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-2">
                Step 2: Check-in/out
              </h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <label className="block text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Check-in
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      disabled={!isStep2Enabled}
                      min={today}
                      className="w-full pl-2 pr-8 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-[#389cfa] focus:border-[#389cfa] disabled:opacity-50"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <Calendar className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Check-out
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      disabled={!isStep2Enabled}
                      min={checkIn || today}
                      className="w-full pl-2 pr-8 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-[#389cfa] focus:border-[#389cfa] disabled:opacity-50"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <Calendar className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Guests */}
            <div className={!isStep3Enabled ? 'opacity-50 pointer-events-none' : ''}>
              <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-2">
                Step 3: Guests
              </h3>
              <div className="flex flex-col sm:flex-row gap-2 p-2.5 border rounded-lg border-gray-200 dark:border-gray-700">
                <div className="flex-1">
                  <label className="block text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Adults
                  </label>
                  <div className="flex items-center">
                    <button
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      disabled={!isStep3Enabled}
                      className="px-1.5 py-1 border border-gray-300 dark:border-gray-600 rounded-l-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <input
                      type="text"
                      value={adults}
                      readOnly
                      className="w-10 text-center text-xs border-y border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-1"
                    />
                    <button
                      onClick={() => setAdults(adults + 1)}
                      disabled={!isStep3Enabled}
                      className="px-1.5 py-1 border border-gray-300 dark:border-gray-600 rounded-r-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Children
                  </label>
                  <div className="flex items-center">
                    <button
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      disabled={!isStep3Enabled}
                      className="px-1.5 py-1 border border-gray-300 dark:border-gray-600 rounded-l-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <input
                      type="text"
                      value={children}
                      readOnly
                      className="w-10 text-center text-xs border-y border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white py-1"
                    />
                    <button
                      onClick={() => setChildren(children + 1)}
                      disabled={!isStep3Enabled}
                      className="px-1.5 py-1 border border-gray-300 dark:border-gray-600 rounded-r-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Selection Summary */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
              <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mb-2">
                Your Selection
              </h3>
              <div className="space-y-1.5 text-[10px] sm:text-xs text-gray-600 dark:text-gray-300">
                <div className="flex justify-between items-center">
                  <span>Branch:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {selectedBranch || '-'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Check-in/out:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {checkIn && checkOut ? `${checkIn} - ${checkOut}` : '-'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Guests:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {checkIn && checkOut ? `${adults} Adults, ${children} Children` : '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* Check Availability Button */}
            <button
              onClick={handleCheckAvailability}
              disabled={!isFormComplete || isLoading}
              className="w-full flex items-center justify-center rounded-lg h-9 sm:h-10 px-4 bg-[#389cfa] text-white text-xs sm:text-sm font-bold tracking-wide disabled:bg-gray-300 disabled:dark:bg-gray-700 disabled:cursor-not-allowed hover:bg-[#389cfa]/90 transition-colors"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Checking...
                </>
              ) : (
                'Check Availability'
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900/50 mt-4 sm:mt-6 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto py-4 sm:py-5 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex space-x-4 order-2 sm:order-1">
              <a className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors" href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <span className="sr-only">Facebook</span>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors" href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <span className="sr-only">Instagram</span>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.525c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zM12 8.118c-2.147 0-3.882 1.735-3.882 3.882s1.735 3.882 3.882 3.882 3.882-1.735 3.882-3.882S14.147 8.118 12 8.118zM12 14.162c-1.205 0-2.182-.977-2.182-2.182s.977-2.182 2.182-2.182 2.182.977 2.182 2.182-.977 2.182-2.182 2.182zM16.802 6.11a1.226 1.226 0 100 2.452 1.226 1.226 0 000-2.452z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
            <nav className="flex flex-wrap justify-center gap-2 sm:gap-4 text-[10px] sm:text-xs order-1 sm:order-2">
              <a className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors" href="#">
                Contact Us
              </a>
              <a className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors" href="#">
                Privacy Policy
              </a>
              <a className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors" href="#">
                Terms of Service
              </a>
            </nav>
          </div>
          <p className="mt-3 sm:mt-4 text-center text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
            © 2025 Morena Hotels. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default BookingSearchPage;