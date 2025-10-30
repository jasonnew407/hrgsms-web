import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Banknote, Building2, Lock, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import WebHeader from '../components/WebHeader';
import WebFooter from '../components/WebFooter';
import { stripePromise } from '../config/stripe';
import StripePaymentForm from '../components/AdminComponent/StripePaymentForm';



const FinalizeBookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const stripeFormRef = useRef(null);
  
  // Get data from location state or sessionStorage
  const getBookingData = () => {
    if (location.state?.selectedRoom && location.state?.bookingDetails) {
      sessionStorage.setItem('bookingData', JSON.stringify(location.state));
      return location.state;
    }
    
    const savedData = sessionStorage.getItem('bookingData');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        console.error('Error parsing booking data:', e);
        return null;
      }
    }
    
    return null;
  };

  const bookingData = getBookingData();
  const selectedRoom = bookingData?.selectedRoom;
  const searchCriteria = bookingData?.searchCriteria;
  const bookingDetails = bookingData?.bookingDetails;

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  // Updated formData - removed card fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  // Show error page if no booking data
  if (!selectedRoom || !bookingDetails) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f5f7f8] dark:bg-[#0f1923]">
        <WebHeader />
        <main className="flex-1 flex items-center justify-center px-4 py-16 mt-16">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
              <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No Booking Information Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Please select a room first to continue with your booking.
            </p>
            <button
              onClick={() => navigate('/booking-search')}
              className="w-full py-3 bg-[#389cfa] text-white font-bold rounded-lg hover:bg-[#2b7fd4] transition-colors"
            >
              Search for Rooms
            </button>
          </div>
        </main>
        <WebFooter />
      </div>
    );
  }

  const cashPaymentAmount = Math.round(bookingDetails.totalPrice * 0.7);
  const remainingAmount = bookingDetails.totalPrice - cashPaymentAmount;

  // Simplified handleInputChange - no card formatting
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    setErrorMessage('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('File size must be less than 5MB');
        return;
      }
      setUploadedFile(file);
      setErrorMessage('');
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  // Updated validateForm - removed card validation
  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setErrorMessage('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setErrorMessage('Last name is required');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage('Please enter a valid email address');
      return false;
    }
    
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!formData.phone.trim() || !phoneRegex.test(formData.phone)) {
      setErrorMessage('Please enter a valid phone number');
      return false;
    }
    
    if (!termsAccepted) {
      setErrorMessage('Please accept the Terms & Conditions');
      return false;
    }

    return true;
  };

  // Updated handleCardPayment to use Stripe component
  const handleCardPayment = async () => {
    try {
      setErrorMessage('');
      setIsSubmitting(true);

      // Step 1: Create payment intent
      const paymentIntentRes = await axios.post('/api/booking/create-payment-intent', {
        amount: bookingDetails.totalPrice,
        currency: 'usd',
        metadata: {
          roomTypeId: selectedRoom.roomTypeId,
          roomType: selectedRoom.typeName,
          guestEmail: formData.email,
          checkInDate: bookingDetails.checkInDate,
          checkOutDate: bookingDetails.checkOutDate
        }
      });

      if (!paymentIntentRes.data.success) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret, paymentIntentId } = paymentIntentRes.data.data;

      // Step 2: Process payment via Stripe component
      const paymentResult = await stripeFormRef.current.handlePayment(clientSecret);

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Payment failed');
      }

      // Step 3: Extract payment details from Stripe response
      const { paymentIntent } = paymentResult;
      const paymentMethod = paymentIntent.payment_method;
      
      // Get card details from payment intent if available
      let cardLast4 = 'N/A';
      let cardBrand = 'Unknown';
      
      if (paymentMethod && typeof paymentMethod === 'object') {
        cardLast4 = paymentMethod.card?.last4 || 'N/A';
        cardBrand = paymentMethod.card?.brand || 'Unknown';
      }

      // Step 4: Finalize booking
      const bookingRes = await axios.post('/api/booking/finalize/card', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        roomId: selectedRoom.roomId || selectedRoom.roomTypeId,
        hotelId: searchCriteria?.hotelId || bookingDetails?.hotelId,
        checkInDate: bookingDetails.checkInDate,
        checkOutDate: bookingDetails.checkOutDate,
        adults: parseInt(bookingDetails.adults),
        children: parseInt(bookingDetails.children),
        numberOfGuests: parseInt(bookingDetails.adults) + parseInt(bookingDetails.children),
        roomRate: bookingDetails.pricePerNight,
        totalAmount: bookingDetails.totalPrice,
        stripePaymentIntentId: paymentIntentId,
        cardLast4: cardLast4,
        cardBrand: cardBrand
      });

      if (bookingRes.data.success) {
        setBookingResult(bookingRes.data.data);
        setShowSuccessModal(true);
        sessionStorage.removeItem('bookingData');
      } else {
        throw new Error(bookingRes.data.message || 'Booking failed');
      }
    } catch (error) {
      console.error('Card payment error:', error);
      setErrorMessage(
        error.response?.data?.message || 
        error.message || 
        'Payment failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Cash Payment
  const handleCashPayment = async () => {
    try {
      setErrorMessage('');
      setIsSubmitting(true);

      if (!uploadedFile) {
        setErrorMessage('Please upload proof of payment (70% advance)');
        setIsSubmitting(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('roomId', selectedRoom.roomId || selectedRoom.roomTypeId);
      formDataToSend.append('hotelId', searchCriteria?.hotelId || bookingDetails?.hotelId);
      formDataToSend.append('checkInDate', bookingDetails.checkInDate);
      formDataToSend.append('checkOutDate', bookingDetails.checkOutDate);
      formDataToSend.append('adults', bookingDetails.adults);
      formDataToSend.append('children', bookingDetails.children);
      formDataToSend.append('numberOfGuests', parseInt(bookingDetails.adults) + parseInt(bookingDetails.children));
      formDataToSend.append('roomRate', bookingDetails.pricePerNight);
      formDataToSend.append('totalAmount', bookingDetails.totalPrice);
      formDataToSend.append('advanceAmount', cashPaymentAmount);
      formDataToSend.append('proofOfPayment', uploadedFile);

      const bookingRes = await axios.post('/api/booking/finalize/cash', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (bookingRes.data.success) {
        setBookingResult(bookingRes.data.data);
        setShowSuccessModal(true);
        sessionStorage.removeItem('bookingData');
      } else {
        throw new Error(bookingRes.data.message || 'Booking failed');
      }
    } catch (error) {
      console.error('Cash payment error:', error);
      setErrorMessage(
        error.response?.data?.message || 
        error.message || 
        'Booking failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Bank Transfer Payment
  const handleBankPayment = async () => {
    try {
      setErrorMessage('');
      setIsSubmitting(true);

      if (!uploadedFile) {
        setErrorMessage('Please upload bank transfer receipt');
        setIsSubmitting(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('roomId', selectedRoom.roomId || selectedRoom.roomTypeId);
      formDataToSend.append('hotelId', searchCriteria?.hotelId || bookingDetails?.hotelId);
      formDataToSend.append('checkInDate', bookingDetails.checkInDate);
      formDataToSend.append('checkOutDate', bookingDetails.checkOutDate);
      formDataToSend.append('adults', bookingDetails.adults);
      formDataToSend.append('children', bookingDetails.children);
      formDataToSend.append('numberOfGuests', parseInt(bookingDetails.adults) + parseInt(bookingDetails.children));
      formDataToSend.append('roomRate', bookingDetails.pricePerNight);
      formDataToSend.append('totalAmount', bookingDetails.totalPrice);
      formDataToSend.append('proofOfPayment', uploadedFile);

      const bookingRes = await axios.post('/api/booking/finalize/bank', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (bookingRes.data.success) {
        setBookingResult(bookingRes.data.data);
        setShowSuccessModal(true);
        sessionStorage.removeItem('bookingData');
      } else {
        throw new Error(bookingRes.data.message || 'Booking failed');
      }
    } catch (error) {
      console.error('Bank transfer error:', error);
      setErrorMessage(
        error.response?.data?.message || 
        error.message || 
        'Booking failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    if (paymentMethod === 'card') {
      await handleCardPayment();
    } else if (paymentMethod === 'cash') {
      await handleCashPayment();
    } else if (paymentMethod === 'bank') {
      await handleBankPayment();
    }
  };

  const getButtonText = () => {
    if (isSubmitting) return 'Processing...';
    
    switch (paymentMethod) {
      case 'card':
        return 'Confirm & Pay';
      case 'cash':
        return 'Confirm Reservation';
      case 'bank':
        return 'Submit for Confirmation';
      default:
        return 'Confirm';
    }
  };

  const SuccessModal = () => {
    if (!bookingResult) return null;

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-2xl animate-scale-in">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {paymentMethod === 'card' ? 'Booking Confirmed!' : 'Booking Request Submitted!'}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {bookingResult.message || 'Your booking has been processed successfully.'}
            </p>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 text-left">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Reservation Number:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {bookingResult.reservationNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Guest Name:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {bookingResult.guestName || `${formData.firstName} ${formData.lastName}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Email:</span>
                  <span className="font-semibold text-gray-900 dark:text-white break-all">
                    {bookingResult.email || formData.email}
                  </span>
                </div>
                {selectedRoom.typeName && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Room:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {selectedRoom.typeName}
                    </span>
                  </div>
                )}
                {paymentMethod === 'cash' && (
                  <div className="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                    <span className="text-gray-600 dark:text-gray-400">Remaining Amount:</span>
                    <span className="font-semibold text-orange-600 dark:text-orange-400">
                      ${remainingAmount}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {paymentMethod !== 'card' && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-6">
                <p className="text-xs text-yellow-800 dark:text-yellow-300">
                  {paymentMethod === 'cash' 
                    ? `Please bring the remaining amount of $${remainingAmount} when checking in.`
                    : 'You will receive a confirmation email once payment is verified (usually within 24 hours).'}
                </p>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate('/my-bookings')}
                className="w-full py-3 bg-[#389cfa] text-white font-bold rounded-lg hover:bg-[#2b7fd4] transition-colors"
              >
                View My Bookings
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f7f8] dark:bg-[#0f1923]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Manrope:wght@200;300;400;500;600;700;800&display=swap');
        body {
          font-family: 'Manrope', sans-serif;
        }
        .font-display { 
          font-family: 'Playfair Display', serif; 
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>

      <WebHeader />

      <main className="flex-1 px-4 md:px-10 lg:px-20 py-6 mx-auto w-full max-w-7xl mt-16">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap justify-between gap-2 p-3">
            <div className="flex min-w-72 flex-col gap-2">
              <p className="text-2xl sm:text-3xl font-black leading-tight text-[#111518] dark:text-white">
                Finalize your booking
              </p>
              <p className="text-sm font-normal leading-normal text-[#5f768c] dark:text-gray-400">
                Complete your booking by providing your details and payment information.
              </p>
            </div>
          </div>

          {errorMessage && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-600 dark:text-red-400 text-sm">{errorMessage}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 items-start">
            <div className="lg:col-span-2 flex flex-col gap-4">
              {/* Guest Information */}
              <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-xl shadow-sm">
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-[#111518] dark:text-white">
                  Guest Information
                </h2>
                <form className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#389cfa] focus:border-[#389cfa] px-3 py-2 text-sm"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#389cfa] focus:border-[#389cfa] px-3 py-2 text-sm"
                      placeholder="Doe"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#389cfa] focus:border-[#389cfa] px-3 py-2 text-sm"
                      placeholder="john.doe@example.com"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#389cfa] focus:border-[#389cfa] px-3 py-2 text-sm"
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </div>
                </form>
              </div>

              {/* Payment Method */}
              <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-xl shadow-sm">
                <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-[#111518] dark:text-white">
                  Choose Your Payment Method
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('card');
                      setUploadedFile(null);
                      setErrorMessage('');
                    }}
                    className={`flex flex-col items-center justify-center gap-1.5 p-3 border-2 rounded-lg font-semibold transition-colors ${
                      paymentMethod === 'card'
                        ? 'border-[#389cfa] bg-[#389cfa]/10 text-[#389cfa]'
                        : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-[#389cfa] hover:bg-[#389cfa]/5'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span className="text-xs">Card Payment</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('cash');
                      setErrorMessage('');
                    }}
                    className={`flex flex-col items-center justify-center gap-1.5 p-3 border-2 rounded-lg font-semibold transition-colors ${
                      paymentMethod === 'cash'
                        ? 'border-[#389cfa] bg-[#389cfa]/10 text-[#389cfa]'
                        : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-[#389cfa] hover:bg-[#389cfa]/5'
                    }`}
                  >
                    <Banknote className="w-5 h-5" />
                    <span className="text-xs">Pay with Cash</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('bank');
                      setErrorMessage('');
                    }}
                    className={`flex flex-col items-center justify-center gap-1.5 p-3 border-2 rounded-lg font-semibold transition-colors ${
                      paymentMethod === 'bank'
                        ? 'border-[#389cfa] bg-[#389cfa]/10 text-[#389cfa]'
                        : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-[#389cfa] hover:bg-[#389cfa]/5'
                    }`}
                  >
                    <Building2 className="w-5 h-5" />
                    <span className="text-xs">Bank Transfer</span>
                  </button>
                </div>

                {/* Card Payment View - Using Stripe Component */}
                {paymentMethod === 'card' && (
                  <Elements stripe={stripePromise}>
                    <StripePaymentForm
                      ref={stripeFormRef}
                      onPaymentSuccess={(paymentIntent) => {
                        console.log('Payment successful:', paymentIntent);
                      }}
                      onPaymentError={(error) => {
                        setErrorMessage(error);
                      }}
                    />
                  </Elements>
                )}

                {/* Cash Payment View */}
                {paymentMethod === 'cash' && (
                  <div>
                    <h3 className="text-base sm:text-lg font-bold mb-3 text-[#111518] dark:text-white">
                      Pay 70% Advance via Bank Transfer
                    </h3>
                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 mb-3">
                      <p className="font-semibold mb-1.5 text-sm">Advance Payment Required: ${cashPaymentAmount}</p>
                      <p className="text-xs">
                        Transfer 70% (${cashPaymentAmount}) to confirm. Pay remaining ${remainingAmount} at check-in.
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 mb-3 text-xs sm:text-sm">
                      <p className="font-semibold text-gray-900 dark:text-white mb-1">Bank Account Details:</p>
                      <p className="text-gray-700 dark:text-gray-300">Account Name: Morena Hotels Inc.</p>
                      <p className="text-gray-700 dark:text-gray-300">Bank: Global Trust Bank</p>
                      <p className="text-gray-700 dark:text-gray-300">Account Number: 123-456-789012</p>
                      <p className="text-gray-700 dark:text-gray-300">SWIFT/BIC: GTBKLON1XXX</p>
                    </div>

                    <div className="mb-3">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Upload Proof of Payment (70% - ${cashPaymentAmount}) *
                      </label>
                      {!uploadedFile ? (
                        <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-4 pb-5">
                            <Upload className="w-7 h-7 text-gray-500 dark:text-gray-400 mb-2" />
                            <p className="mb-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">PNG, JPG or PDF (MAX. 5MB)</p>
                          </div>
                          <input type="file" className="hidden" onChange={handleFileUpload} accept=".png,.jpg,.jpeg,.pdf" />
                        </label>
                      ) : (
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                            <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 truncate">{uploadedFile.name}</span>
                          </div>
                          <button type="button" onClick={removeFile} className="text-red-500 hover:text-red-700 transition-colors ml-2 flex-shrink-0">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Bank Transfer View */}
                {paymentMethod === 'bank' && (
                  <div>
                    <h3 className="text-base sm:text-lg font-bold mb-3 text-[#111518] dark:text-white">
                      Bank Transfer Details
                    </h3>
                    <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 mb-3 text-xs sm:text-sm">
                      <p className="font-semibold text-gray-900 dark:text-white mb-1">Bank Account Details:</p>
                      <p className="text-gray-700 dark:text-gray-300">Account Name: Morena Hotels Inc.</p>
                      <p className="text-gray-700 dark:text-gray-300">Bank: Global Trust Bank</p>
                      <p className="text-gray-700 dark:text-gray-300">Account Number: 123-456-789012</p>
                      <p className="text-gray-700 dark:text-gray-300">SWIFT/BIC: GTBKLON1XXX</p>
                      <p className="text-gray-700 dark:text-gray-300 mt-2 pt-2 border-t border-gray-300 dark:border-gray-600 font-semibold">
                        Total Amount: ${bookingDetails.totalPrice}
                      </p>
                    </div>

                    <div className="mb-3">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Upload Bank Transfer Receipt *
                      </label>
                      {!uploadedFile ? (
                        <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-4 pb-5">
                            <Upload className="w-7 h-7 text-gray-500 dark:text-gray-400 mb-2" />
                            <p className="mb-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">PNG, JPG or PDF (MAX. 5MB)</p>
                          </div>
                          <input type="file" className="hidden" onChange={handleFileUpload} accept=".png,.jpg,.jpeg,.pdf" />
                        </label>
                      ) : (
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                            <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 truncate">{uploadedFile.name}</span>
                          </div>
                          <button type="button" onClick={removeFile} className="text-red-500 hover:text-red-700 transition-colors ml-2 flex-shrink-0">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                      <p className="text-xs">
                        Your booking will be confirmed once payment is verified (usually within 24 hours).
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Terms & Conditions */}
              <div className="bg-white dark:bg-gray-800 p-4 sm:p-5 rounded-xl shadow-sm">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#389cfa] bg-gray-100 border-gray-300 rounded focus:ring-[#389cfa] focus:ring-2"
                  />
                  <label htmlFor="terms" className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                    I agree to the{' '}
                    <a href="/terms" className="text-[#389cfa] hover:underline font-semibold">
                      Terms & Conditions
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-[#389cfa] hover:underline font-semibold">
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!termsAccepted || isSubmitting}
                className={`w-full py-3 sm:py-4 rounded-lg font-bold text-white text-base sm:text-lg transition-all ${
                  !termsAccepted || isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#389cfa] hover:bg-[#2b7fd4] shadow-lg hover:shadow-xl'
                }`}
              >
                {isSubmitting && (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {getButtonText()}
              </button>
            </div>

            {/* Right Column - Booking Summary */}
            <div className="lg:col-span-1 lg:sticky lg:top-24">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 sm:p-5">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg mb-3"
                    style={{ backgroundImage: `url("${selectedRoom.images?.[0] || '/placeholder-room.jpg'}")` }}
                  />
                  <div className="flex flex-col gap-1.5">
                    <p className="text-xs font-normal text-[#5f768c] dark:text-gray-400">
                      Your Booking Summary
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-[#111518] dark:text-white">
                      {selectedRoom.typeName}
                    </p>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-xs font-normal text-[#5f768c] dark:text-gray-400">
                        Check-in: {bookingDetails.checkInDate}
                      </p>
                      <p className="text-xs font-normal text-[#5f768c] dark:text-gray-400">
                        Check-out: {bookingDetails.checkOutDate}
                      </p>
                      <p className="text-xs font-normal text-[#5f768c] dark:text-gray-400">
                        {bookingDetails.adults} Adults, {bookingDetails.children} Children
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <h3 className="text-base sm:text-lg font-bold mb-2 text-[#111518] dark:text-white">
                      Price Breakdown
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          ${bookingDetails.pricePerNight} × {bookingDetails.nights} nights
                        </span>
                        <span className="font-semibold text-[#111518] dark:text-white">
                          ${bookingDetails.totalPrice}
                        </span>
                      </div>
                      
                      {paymentMethod === 'cash' && (
                        <>
                          <div className="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-gray-600">
                            <span className="text-gray-600 dark:text-gray-400">Advance Payment (70%)</span>
                            <span className="font-semibold text-green-600 dark:text-green-400">
                              ${cashPaymentAmount}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Pay at Check-in (30%)</span>
                            <span className="font-semibold text-orange-600 dark:text-orange-400">
                              ${remainingAmount}
                            </span>
                          </div>
                        </>
                      )}
                      
                      <div className="flex justify-between items-center pt-3 border-t-2 border-gray-300 dark:border-gray-600">
                        <span className="text-base font-bold text-[#111518] dark:text-white">
                          {paymentMethod === 'cash' ? 'Pay Now' : 'Total'}
                        </span>
                        <span className="text-xl font-bold text-[#389cfa]">
                          ${paymentMethod === 'cash' ? cashPaymentAmount : bookingDetails.totalPrice}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2 text-green-800 dark:text-green-300">
                  <Lock className="w-4 h-4" />
                  <span className="text-xs font-semibold">Your data is secure and encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <WebFooter />

      {showSuccessModal && <SuccessModal />}
    </div>
  );
};

export default FinalizeBookingPage;
