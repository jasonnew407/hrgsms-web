import React, { useState } from 'react';
import { CheckCircle, Clock, Eye, Printer, Home } from 'lucide-react';
import WebHeader from '../components/WebHeader';
import WebFooter from '../components/WebFooter';
import morenaLogo from '../assets/new_logo.png'; // Update with your logo path

const BookingConfirmationPage = () => {
  const [bookingStatus] = useState('confirmed'); // 'confirmed' or 'pending'

  const confirmedBooking = {
    reservationId: 'MH-2024-54321',
    roomName: 'Deluxe King Room',
    hotelName: 'Morena Hotel',
    branch: 'Weligama Beach Branch',
    guests: 2,
    checkIn: 'Jul 15, 2024',
    checkOut: 'Jul 20, 2024',
    nights: 5,
    totalPrice: 1250.00,
    roomImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmp9mDS23qejgqhPQwQiHIfK9N0-TcW8RbZbMIoDBNTNKQUrPgi0bHkfjkp054pOWQVxPP_0NkTzsA6sYRZ0fXok4OUuGw-OasS4f35H9dY6Pnczxf_bzh-mN3h82S__ACKv8XOi1gveJzaadh5CMFkiv5Z4U4YfEeeZYe0xmVXtKudyUXY_7M2hSDUvoOrG8wu6kQlXMp8-PKQ70tsMebIWJlj7_CMnHyR8mnT9Dc2w4rNTZ5IZ6uCIaOmJB1Fra187wQkmmNbg',
    customerDetails: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567'
    },
    paymentDetails: {
      method: 'Credit Card',
      cardLast4: '4242',
      basePrice: 1000.00,
      taxes: 150.00,
      serviceFees: 100.00,
      total: 1250.00
    }
  };

  const pendingBooking = {
    reservationId: 'MH-2024-54322',
    roomName: 'Standard Double Room',
    hotelName: 'Morena Hotel',
    branch: 'Midigama Beach Branch',
    guests: 2,
    checkIn: 'Aug 01, 2024',
    checkOut: 'Aug 05, 2024',
    nights: 4,
    totalPrice: 800.00,
    roomImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAb5QOlKY1lN4DZa7-IEUdxucA2EeUIfv6KRxZG5Q0PByeUBtf-_PIpVfrcs16BLfK9Mi1-C7U6wNQL8T6kUDFs6Px23Tt_lmCRNfwAdjQPSw1Dy6FcIOppDbZ2hVImLi2BgCfzc3egPz_0jKIp83-HN8JjdRvdSXT5U8yEi0lJgqbU_SfR4DggQ3SLsBV27OFnvkFJWMG_H241RMIc8rrFFvX9wzkdz35qFK9jnlRJqWKS2wrsKkYKkxXZ7f6XdDNMz1BzJ1JQsA',
    customerDetails: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+1 (555) 987-6543'
    },
    paymentDetails: {
      method: 'Bank Transfer',
      basePrice: 640.00,
      taxes: 96.00,
      serviceFees: 64.00,
      total: 800.00
    }
  };

  const booking = bookingStatus === 'confirmed' ? confirmedBooking : pendingBooking;

  const handleViewBooking = () => {
    console.log('View booking:', booking.reservationId);
  };

  const handlePrintConfirmation = () => {
    window.print();
  };

  const handleReturnHome = () => {
    window.location.href = '/';
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
        @media print {
          .no-print {
            display: none !important;
          }
          .print-only {
            display: block !important;
          }
          body {
            background: white !important;
          }
          .print-document {
            max-width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            box-shadow: none !important;
          }
        }
        .print-only {
          display: none;
        }
      `}</style>

      {/* Header */}
      <div className="no-print">
        <WebHeader />
      </div>

      {/* Printable Document (Hidden on screen, visible on print) */}
      <div className="print-only">
        <div className="print-document max-w-4xl mx-auto bg-white p-8">
          {/* Header with Logo */}
          <div className="flex items-center justify-between border-b-2 border-gray-300 pb-6 mb-6">
            <div className="flex items-center gap-3">
              <img src={morenaLogo} alt="Morena Hotels" className="w-16 h-16" />
              <div>
                <h1 className="text-2xl font-bold text-[#003366]">Morena Hotels</h1>
                <p className="text-sm text-gray-600">{booking.branch}</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-[#003366]">BOOKING CONFIRMATION</h2>
              <p className="text-sm text-gray-600">Reservation ID: {booking.reservationId}</p>
              <p className="text-sm text-gray-600">Date: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Customer Details */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-[#003366] mb-3 border-b border-gray-200 pb-2">Guest Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Guest Name</p>
                <p className="font-semibold">{booking.customerDetails.firstName} {booking.customerDetails.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{booking.customerDetails.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold">{booking.customerDetails.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Number of Guests</p>
                <p className="font-semibold">{booking.guests} Guests</p>
              </div>
            </div>
          </div>

          {/* Reservation Details */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-[#003366] mb-3 border-b border-gray-200 pb-2">Reservation Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Room Type</p>
                <p className="font-semibold">{booking.roomName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Hotel</p>
                <p className="font-semibold">{booking.hotelName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Check-in Date</p>
                <p className="font-semibold">{booking.checkIn}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Check-out Date</p>
                <p className="font-semibold">{booking.checkOut}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Number of Nights</p>
                <p className="font-semibold">{booking.nights} Nights</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Check-in Time</p>
                <p className="font-semibold">2:00 PM</p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-[#003366] mb-3 border-b border-gray-200 pb-2">Payment Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Base Price ({booking.nights} nights)</span>
                <span className="font-semibold">${booking.paymentDetails.basePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taxes & Fees</span>
                <span className="font-semibold">${booking.paymentDetails.taxes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service Fees</span>
                <span className="font-semibold">${booking.paymentDetails.serviceFees.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t-2 border-gray-300 pt-2 mt-2">
                <span className="text-lg font-bold text-[#003366]">Total Amount</span>
                <span className="text-lg font-bold text-[#003366]">${booking.paymentDetails.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-semibold">{booking.paymentDetails.method}</span>
              </div>
              {booking.paymentDetails.cardLast4 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Card Ending</span>
                  <span className="font-semibold">****{booking.paymentDetails.cardLast4}</span>
                </div>
              )}
            </div>
          </div>

          {/* Important Information */}
          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <h3 className="text-base font-bold text-[#003366] mb-2">Important Information</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Please bring a valid government-issued photo ID at check-in</li>
              <li>• Check-in time: 2:00 PM | Check-out time: 12:00 PM (noon)</li>
              <li>• Cancellation policy: Free cancellation up to 14 days before check-in</li>
              <li>• For any changes or inquiries, please contact us at +1 (234) 567-890</li>
            </ul>
          </div>

          {/* Footer */}
          <div className="border-t-2 border-gray-300 pt-4 text-center">
            <p className="text-sm text-gray-600">Thank you for choosing Morena Hotels!</p>
            <p className="text-sm text-gray-600">We look forward to welcoming you.</p>
            <p className="text-xs text-gray-500 mt-2">
              Morena Hotels | Email: info@morenahotels.com | Phone: +1 (234) 567-890
            </p>
          </div>
        </div>
      </div>

      {/* Main Content (Screen View) */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 mt-16 no-print">
        <div className="max-w-5xl mx-auto">
          {/* Success/Pending State */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 sm:p-6 mb-5 sm:mb-6">
            <div className="flex flex-col md:flex-row items-center gap-3 sm:gap-5">
              <div className="flex-shrink-0">
                <div className={`${
                  bookingStatus === 'confirmed' ? 'bg-green-500' : 'bg-yellow-500'
                } rounded-full p-2.5 text-white`}>
                  {bookingStatus === 'confirmed' ? (
                    <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10" />
                  ) : (
                    <Clock className="w-8 h-8 sm:w-10 sm:h-10" />
                  )}
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className={`${
                  bookingStatus === 'confirmed' ? 'text-green-500' : 'text-yellow-500'
                } text-xl sm:text-2xl md:text-3xl font-black leading-tight`}>
                  {bookingStatus === 'confirmed' 
                    ? 'Booking Confirmed!' 
                    : 'Booking Submitted for Verification'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mt-1.5">
                  {bookingStatus === 'confirmed'
                    ? 'Your reservation has been successfully made.'
                    : 'Your booking is pending until we verify your bank transfer slip.'}
                </p>
              </div>
            </div>

            <p className="text-[#111518] dark:text-gray-300 text-xs sm:text-sm mt-3 sm:mt-4">
              Reservation ID:{' '}
              <span className="font-bold bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {booking.reservationId}
              </span>
            </p>

            {/* Booking Details Card */}
            <div className="mt-3 sm:mt-4">
              <div className="flex flex-col lg:flex-row rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 overflow-hidden">
                <div
                  className="w-full lg:w-1/3 bg-center bg-no-repeat aspect-video lg:aspect-square bg-cover"
                  style={{ backgroundImage: `url("${booking.roomImage}")` }}
                  role="img"
                  aria-label={booking.roomName}
                />
                <div className="flex w-full flex-col justify-center gap-1.5 p-3 sm:p-4">
                  <p className="text-gray-600 dark:text-gray-400 text-xs">
                    {booking.hotelName}
                  </p>
                  <p className="text-[#111518] dark:text-white text-sm sm:text-base font-bold">
                    {booking.roomName}
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-end gap-1.5 sm:gap-2 justify-between mt-1">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                        {booking.guests} guests
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                        Check-in: {booking.checkIn} | Check-out: {booking.checkOut}
                      </p>
                    </div>
                    <div className={`flex items-center justify-center rounded-lg h-7 px-3 ${
                      bookingStatus === 'confirmed'
                        ? 'bg-[#389cfa]/20 text-[#389cfa]'
                        : 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                    } text-xs font-medium whitespace-nowrap`}>
                      Total: ${booking.totalPrice.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* What's Next Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 mt-4 sm:mt-5 pt-3 sm:pt-4">
              <h3 className="text-[#111518] dark:text-white text-sm sm:text-base font-bold mb-1.5">
                What's next?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-3">
                {bookingStatus === 'confirmed'
                  ? 'You can print a copy of your confirmation or return to the homepage.'
                  : 'You can view your booking status or return to the homepage. You will receive an email confirmation once your payment is verified.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                {bookingStatus === 'confirmed' ? (
                  <>
                    <button
                      onClick={handlePrintConfirmation}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg h-9 px-3 bg-[#389cfa] text-white text-xs font-bold hover:bg-[#389cfa]/90 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Confirmation</span>
                    </button>
                    <button
                      onClick={handleReturnHome}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg h-9 px-3 bg-gray-200 dark:bg-gray-700 text-[#111518] dark:text-white text-xs font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Home className="w-3.5 h-3.5" />
                      <span>Return to Homepage</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleViewBooking}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg h-9 px-3 bg-[#389cfa] text-white text-xs font-bold hover:bg-[#389cfa]/90 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View My Booking</span>
                    </button>
                    <button
                      onClick={handleReturnHome}
                      className="flex-1 flex items-center justify-center gap-2 rounded-lg h-9 px-3 bg-gray-200 dark:bg-gray-700 text-[#111518] dark:text-white text-xs font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Home className="w-3.5 h-3.5" />
                      <span>Return to Homepage</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="text-center p-4 sm:p-5 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <h3 className="text-[#111518] dark:text-white text-sm sm:text-base font-bold mb-1.5">
              Have any questions?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
              Contact us at{' '}
              <a className="text-[#389cfa] font-medium hover:underline" href="tel:+94 11 123 4567">
                +94 (11) 123 4567
              </a>{' '}
              or{' '}
              <a className="text-[#389cfa] font-medium hover:underline" href="mailto:info@morenahotels.com">
                support@morenahotels.com
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="no-print">
        <WebFooter />
      </div>
    </div>
  );
};

export default BookingConfirmationPage;