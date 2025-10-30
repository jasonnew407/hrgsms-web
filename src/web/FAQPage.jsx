import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import WebHeader from '../components/WebHeader';
import WebFooter from '../components/WebFooter';

const FAQPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [openFAQ, setOpenFAQ] = useState(0);

    const faqs = [
        {
            question: "Bookings & Reservations",
            answer: "You can book a room directly on our website, through our mobile app, or by calling our reservations team. We also partner with major online travel agencies."
        },
        {
            question: "What are the check-in and check-out times?",
            answer: "Our standard check-in time is 3:00 PM and check-out is at 11:00 AM. Early check-in and late check-out may be available upon request, subject to availability and a possible fee."
        },
        {
            question: "Payments & Billing",
            answer: "We accept all major credit cards, including Visa, MasterCard, and American Express. We also accept debit cards and cash payments at the front desk."
        },
        {
            question: "What is your cancellation policy?",
            answer: "Cancellations made up to 24 hours before the check-in date are free of charge. Cancellations made within 24 hours of check-in will be subject to a fee equivalent to one night's stay."
        },
        {
            question: "Hotel Amenities & Services",
            answer: "Our hotels offer a variety of amenities, including a fitness center, swimming pool, business center, and on-site dining. Please check the specific hotel page for a full list of amenities."
        },
        {
            question: "Do you offer free Wi-Fi?",
            answer: "Yes, we offer complimentary high-speed Wi-Fi access to all our guests throughout the hotel premises."
        },
        {
            question: "Our Locations",
            answer: "Morena Hotels has locations in major cities across the country. You can find a complete list of our hotels and their addresses on our 'Locations' page."
        },
        {
            question: "Is parking available at your hotels?",
            answer: "Most of our hotels offer on-site parking facilities. Some locations may charge a daily fee for parking. We recommend checking the hotel's specific page for parking details."
        }
    ];

    const filteredFAQs = faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-[#F8F9FA] dark:bg-[#101b22] font-body text-[#343A40] dark:text-[#F8F9FA]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lato:wght@400;700&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&display=swap');
                
                .font-display { font-family: 'Playfair Display', serif; }
                .font-body { font-family: 'Lato', sans-serif; }
                .font-manrope { font-family: 'Manrope', sans-serif; }
            `}</style>

            <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
                <div className="layout-container flex h-full grow flex-col">
                    {/* Header Component */}
                    <WebHeader />

                    {/* Main Content */}
                    <main className="pt-16 flex-1">
                        <div className="flex justify-center py-5 bg-white dark:bg-[#101b22]">
                            <div className="flex flex-col max-w-[960px] w-full px-4 sm:px-6 lg:px-8">
                                <div className="flex flex-col gap-8 py-10">
                                    {/* Page Title */}
                                    <div className="flex flex-wrap justify-between gap-3 p-4">
                                        <h1 className="text-[#111518] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72 font-manrope">
                                            Frequently Asked Questions
                                        </h1>
                                    </div>

                                    {/* Search Bar */}
                                    <div className="px-4 py-3">
                                        <div className="flex flex-col min-w-40 h-12 w-full">
                                            <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                                                <div className="text-[#60798a] dark:text-gray-400 flex bg-[#f0f3f5] dark:bg-gray-800 items-center justify-center pl-4 rounded-l-lg">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                    </svg>
                                                </div>
                                                <input 
                                                    className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-[#111518] dark:text-white focus:outline-0 focus:ring-0 border-none bg-[#f0f3f5] dark:bg-gray-800 h-full placeholder:text-[#60798a] dark:placeholder:text-gray-400 px-4 text-base font-normal leading-normal font-manrope"
                                                    placeholder="Search for a question..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* FAQ Accordion */}
                                    <div className="flex flex-col p-4">
                                        {filteredFAQs.map((faq, index) => (
                                            <details 
                                                key={index}
                                                className={`flex flex-col border-t border-t-[#dbe1e6] dark:border-t-gray-700 py-2 group ${index === filteredFAQs.length - 1 ? 'border-b dark:border-b-gray-700' : ''}`}
                                                open={index === openFAQ}
                                                onClick={() => setOpenFAQ(index)}
                                            >
                                                <summary className="flex cursor-pointer items-center justify-between gap-6 py-2 list-none">
                                                    <p className="text-[#111518] dark:text-gray-200 text-sm font-medium leading-normal font-manrope">
                                                        {faq.question}
                                                    </p>
                                                    <div className="text-[#111518] dark:text-gray-200 group-open:rotate-180 transition-transform">
                                                        <ChevronDown className="w-5 h-5" />
                                                    </div>
                                                </summary>
                                                <p className="text-[#60798a] dark:text-gray-400 text-sm font-normal leading-normal pb-2 font-manrope">
                                                    {faq.answer}
                                                </p>
                                            </details>
                                        ))}
                                    </div>

                                    {/* Contact Section */}
                                    <div className="flex flex-col items-center justify-center text-center gap-4 p-8 mt-10 bg-white dark:bg-gray-800/50 rounded-xl">
                                        <h2 className="text-[#111518] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] font-manrope">
                                            Still Have Questions?
                                        </h2>
                                        <p className="text-[#60798a] dark:text-gray-400 text-sm font-normal leading-normal max-w-md font-manrope">
                                            Can't find the answer you're looking for? Our team is happy to help. Get in touch with us and we'll get back to you as soon as possible.
                                        </p>
                                        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-[#0d93f2] hover:bg-[#0b7ed1] text-white text-sm font-bold leading-normal tracking-[0.015em] mt-2 transition-colors font-manrope">
                                            <span className="truncate">Contact Us</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>

                    {/* Footer Component */}
                    <WebFooter />
                </div>
            </div>
        </div>
    );
};

export default FAQPage;