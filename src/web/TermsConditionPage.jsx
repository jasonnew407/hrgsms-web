import React from 'react';
import WebHeader from '../components/WebHeader';
import WebFooter from '../components/WebFooter';

const TermsConditionsPage = () => {
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
          body * {
            visibility: hidden;
          }
          .printable-content, .printable-content * {
            visibility: visible;
          }
          .printable-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none;
          }
        }
      `}</style>

      {/* Header */}
      <WebHeader />

      {/* Main Content */}
      <main className="printable-content flex flex-1 justify-center py-6 sm:py-10 mt-16 px-4">
        <div className="layout-content-container flex flex-col max-w-3xl w-full">
          {/* Page Title */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-black leading-tight text-[#111518] dark:text-white mb-2">
              Terms & Conditions
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Last Updated: October 19, 2025
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-6 sm:space-y-8">
            {/* Introduction */}
            <section id="introduction" className="bg-white dark:bg-gray-800/50 rounded-lg p-4 sm:p-6 shadow-sm">
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-[#111518] dark:text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-[#389cfa] rounded-full"></span>
                Introduction
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300">
                Welcome to Morena Hotels. By making a booking or reservation with us, you are agreeing to the terms and conditions set out below. These terms are designed to ensure a smooth and pleasant experience for all our guests. Please read them carefully.
              </p>
            </section>

            {/* Booking & Payment Policies */}
            <section id="booking-payment" className="bg-white dark:bg-gray-800/50 rounded-lg p-4 sm:p-6 shadow-sm">
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-[#111518] dark:text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-[#389cfa] rounded-full"></span>
                Booking & Payment Policies
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
                We accept various payment methods for your convenience. All bookings require a valid payment method to be confirmed.
              </p>
              <div className="space-y-3">
                <h3 className="font-semibold text-base text-[#111518] dark:text-white">
                  Accepted Payment Methods
                </h3>
                <ul className="space-y-2.5 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  <li className="flex gap-2">
                    <span className="text-[#389cfa] mt-1">•</span>
                    <span><strong className="text-[#111518] dark:text-white">Credit/Debit Card:</strong> We accept all major credit and debit cards. Full payment is required at the time of booking to secure your reservation.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#389cfa] mt-1">•</span>
                    <span><strong className="text-[#111518] dark:text-white">Cash Payments:</strong> Cash payments are accepted at the front desk upon check-in for the remaining balance or walk-in bookings.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#389cfa] mt-1">•</span>
                    <span><strong className="text-[#111518] dark:text-white">Bank Transfer:</strong> For bookings made via bank transfer, a minimum of 70% advance payment is required. Your booking will be considered tentative and will only be confirmed upon our verification of the submitted transfer slip.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[#389cfa] mt-1">•</span>
                    <span><strong className="text-[#111518] dark:text-white">Mixed Payments:</strong> You may split your payment between different methods. Please contact our front desk to arrange for mixed payments. The same verification rules apply for any portion paid via bank transfer.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Cancellation & Refund Policy */}
            <section id="cancellation" className="bg-white dark:bg-gray-800/50 rounded-lg p-4 sm:p-6 shadow-sm">
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-[#111518] dark:text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-[#389cfa] rounded-full"></span>
                Cancellation & Refund Policy
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
                We understand that plans can change. Our cancellation policy is structured to be as fair as possible.
              </p>
              <ul className="space-y-2.5 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                <li className="flex gap-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span><strong className="text-[#111518] dark:text-white">100% Refund:</strong> Cancellations made more than 14 days prior to the check-in date are eligible for a full refund of the amount paid.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-yellow-500 mt-1">⚠</span>
                  <span><strong className="text-[#111518] dark:text-white">50% Refund:</strong> Cancellations made between 7 and 14 days prior to the check-in date will receive a 50% refund.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500 mt-1">✕</span>
                  <span><strong className="text-[#111518] dark:text-white">No Refund:</strong> Cancellations made less than 7 days prior to the check-in date are non-refundable. This also applies to no-shows and early departures.</span>
                </li>
              </ul>
            </section>

            {/* General Conditions */}
            <section id="general-conditions" className="bg-white dark:bg-gray-800/50 rounded-lg p-4 sm:p-6 shadow-sm">
              <h2 className="text-lg sm:text-xl font-bold mb-3 text-[#111518] dark:text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-[#389cfa] rounded-full"></span>
                General Conditions
              </h2>
              <ul className="space-y-2.5 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                <li className="flex gap-2">
                  <span className="text-[#389cfa] mt-1">•</span>
                  <span><strong className="text-[#111518] dark:text-white">Check-in / Check-out:</strong> Check-in time is from 2:00 PM onwards. Check-out time is before 12:00 PM (noon).</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#389cfa] mt-1">•</span>
                  <span><strong className="text-[#111518] dark:text-white">Guest Identification:</strong> All guests are required to present a valid, government-issued photo identification upon check-in. Foreign nationals must present their passport and a valid visa.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#389cfa] mt-1">•</span>
                  <span><strong className="text-[#111518] dark:text-white">Hotel Policies:</strong> Morena Hotels operates a strict no-smoking policy in all rooms and indoor public areas. Pets are not permitted on the premises, with the exception of service animals.</span>
                </li>
              </ul>
            </section>
          </div>

          {/* Contact Section */}
          <div className="mt-8 bg-gradient-to-r from-[#389cfa]/10 to-[#389cfa]/5 dark:from-[#389cfa]/20 dark:to-[#389cfa]/10 rounded-lg p-4 sm:p-6 text-center">
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-2">
              Have questions about our terms?
            </p>
            <a 
              href="/contact-page" 
              className="inline-flex items-center gap-2 text-[#389cfa] hover:text-[#389cfa]/80 font-semibold text-sm sm:text-base transition-colors"
            >
              Contact Our Team →
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <WebFooter />
    </div>
  );
};

export default TermsConditionsPage;
