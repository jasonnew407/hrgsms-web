import React, { useState } from 'react';
import { Instagram, Facebook, X, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import WebHeader from '../components/WebHeader';
import WebFooter from '../components/WebFooter';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState(null);

    const ThreadsIcon = () => (
        <svg className="w-6 h-6" viewBox="0 0 192 192" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M141.537 88.988a66.667 66.667 0 0 0-2.518-1.143c-1.482-27.307-16.403-42.94-41.457-43.1h-.34c-14.986 0-27.449 6.396-35.12 18.036l13.779 9.452c5.73-8.695 14.113-10.816 21.339-10.816h.229c8.249.069 14.97 2.743 19.409 7.72 3.626 4.06 5.966 9.92 7.134 17.906a86.63 86.63 0 0 0-17.884-1.981c-23.36 0-41.417 11.644-46.94 28.915-2.834 8.874-2.178 17.68 1.828 24.78 4.43 7.856 12.582 12.634 22.16 12.634 9.673 0 17.839-3.984 24.109-11.58 3.725-4.516 6.63-10.066 8.666-16.54 5.135 4.789 8.47 11.303 9.548 19.067.116.847.185 1.701.185 2.564 0 12.63-9.922 23.044-22.115 23.044-12.193 0-22.113-10.413-22.113-23.044 0-1.062.1-2.106.267-3.127-7.656.955-15.125 2.93-22.175 5.84-.35 1.38-.533 2.813-.533 4.287 0 20.378 16.575 36.95 36.954 36.95 20.38 0 36.955-16.572 36.955-36.95 0-20.377-16.575-36.95-36.955-36.95-5.31 0-10.345 1.119-14.9 3.131a37.805 37.805 0 0 1 .433-14.063c3.967-12.422 17.188-20.04 34.267-20.04 7.742 0 15.097.879 21.885 2.61 1.825-6.252 3.036-12.89 3.597-19.806z"/>
        </svg>
    );

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 5000);
    };

    const closeToast = () => {
        setToast(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client-side validation
        if (!formData.fullName || !formData.email || !formData.subject || !formData.message) {
            showToast('error', 'Please fill in all fields.');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showToast('error', 'Please provide a valid email address.');
            return;
        }

        // Message length validation
        if (formData.message.length < 10) {
            showToast('error', 'Message must be at least 10 characters long.');
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await axios.post('/api/contact/submit', formData, {
                headers: { 'Content-Type': 'application/json' },
            });

            // Check if response is successful
            if (res.status >= 200 && res.status < 300) {
                // Extract message from the backend response
                const successMessage = res.data.message || 'Thank you for your message! We will get back to you soon.';
                
                // Show success toast
                showToast('success', successMessage);
                
                // Reset form after successful submission
                setFormData({ fullName: '', email: '', subject: '', message: '' });
            } else {
                showToast('error', 'Failed to submit your message. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting form:', error.response?.data || error.message || error);
            
            // Handle different types of errors
            if (error.response) {
                const errorMessage = error.response.data?.message || 'Failed to submit your message.';
                const errors = error.response.data?.errors;

                if (errors && Array.isArray(errors)) {
                    showToast('error', errors[0].message || errors[0].msg);
                } else {
                    showToast('error', errorMessage);
                }
            } else if (error.request) {
                showToast('error', 'Unable to connect to server. Please check your connection.');
            } else {
                showToast('error', 'An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    return (
        <div className="bg-[#F8F9FA] dark:bg-[#101b22] font-body text-[#343A40] dark:text-[#F8F9FA]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lato:wght@400;700&display=swap');
                .font-display { font-family: 'Playfair Display', serif; }
                .font-body { font-family: 'Lato', sans-serif; }
                
                @keyframes slide-in {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .animate-slide-in {
                    animation: slide-in 0.3s ease-out;
                }
            `}</style>

            {/* Toast Notification */}
            {toast && (
                <div className="fixed top-4 right-4 z-[9999] animate-slide-in max-sm:left-4 max-sm:right-4">
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl min-w-[320px] max-w-md max-sm:min-w-0 ${
                        toast.type === 'success' 
                            ? 'bg-green-50 border-2 border-green-200' 
                            : 'bg-red-50 border-2 border-red-200'
                    }`}>
                        {toast.type === 'success' ? (
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        ) : (
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        )}
                        <p className={`text-sm font-medium flex-1 ${
                            toast.type === 'success' ? 'text-green-800' : 'text-red-800'
                        }`}>
                            {toast.message}
                        </p>
                        <button 
                            onClick={closeToast}
                            className={`flex-shrink-0 hover:opacity-70 transition-opacity ${
                                toast.type === 'success' ? 'text-green-600' : 'text-red-600'
                            }`}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
                <div className="layout-container flex h-full grow flex-col">
                    <WebHeader />

                    <main className="pt-16">
                        <section className="py-12 md:py-20">
                            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                                <h1 className="text-4xl md:text-5xl font-display font-bold text-[#003366] dark:text-white mb-12">Get in Touch</h1>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                    <div className="flex flex-col gap-8">
                                        <h2 className="text-2xl font-display font-bold text-[#003366] dark:text-white">Send Us a Message</h2>
                                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                            <label className="flex flex-col">
                                                <span className="text-[#343A40] dark:text-[#F8F9FA] text-base font-medium mb-2">
                                                    Full Name <span className="text-red-500">*</span>
                                                </span>
                                                <input
                                                    type="text"
                                                    value={formData.fullName}
                                                    onChange={(e) => handleChange('fullName', e.target.value)}
                                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#343A40] dark:text-[#F8F9FA] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#007BFF] transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                    placeholder="Enter your full name"
                                                    disabled={isSubmitting}
                                                    required
                                                />
                                            </label>

                                            <label className="flex flex-col">
                                                <span className="text-[#343A40] dark:text-[#F8F9FA] text-base font-medium mb-2">
                                                    Email Address <span className="text-red-500">*</span>
                                                </span>
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => handleChange('email', e.target.value)}
                                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#343A40] dark:text-[#F8F9FA] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#007BFF] transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                    placeholder="Enter your email address"
                                                    disabled={isSubmitting}
                                                    required
                                                />
                                            </label>

                                            <label className="flex flex-col">
                                                <span className="text-[#343A40] dark:text-[#F8F9FA] text-base font-medium mb-2">
                                                    Subject <span className="text-red-500">*</span>
                                                </span>
                                                <input
                                                    type="text"
                                                    value={formData.subject}
                                                    onChange={(e) => handleChange('subject', e.target.value)}
                                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#343A40] dark:text-[#F8F9FA] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#007BFF] transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                    placeholder="Enter the subject"
                                                    disabled={isSubmitting}
                                                    required
                                                />
                                            </label>

                                            <label className="flex flex-col">
                                                <span className="text-[#343A40] dark:text-[#F8F9FA] text-base font-medium mb-2">
                                                    Message <span className="text-red-500">*</span>
                                                </span>
                                                <textarea
                                                    value={formData.message}
                                                    onChange={(e) => handleChange('message', e.target.value)}
                                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-[#343A40] dark:text-[#F8F9FA] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#007BFF] min-h-[128px] resize-y transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                    placeholder="Write your message here... (minimum 10 characters)"
                                                    disabled={isSubmitting}
                                                    required
                                                />
                                                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {formData.message.length} characters
                                                </span>
                                            </label>

                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className={`bg-[#007BFF] text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 ${
                                                    isSubmitting 
                                                        ? 'opacity-50 cursor-not-allowed' 
                                                        : 'hover:bg-blue-600 cursor-pointer'
                                                }`}
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    'Submit'
                                                )}
                                            </button>
                                        </form>

                                        <div className="flex flex-col gap-4 mt-4">
                                            <div className="flex items-center gap-4">
                                                <svg className="w-6 h-6 text-[#007BFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                                <a href="tel:+94111234567" className="text-[#343A40] dark:text-[#F8F9FA] hover:text-[#007BFF] transition-colors">
                                                    +94 11 123 4567
                                                </a>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <svg className="w-6 h-6 text-[#007BFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                <a href="mailto:info@morenahotels.com" className="text-[#343A40] dark:text-[#F8F9FA] hover:text-[#007BFF] transition-colors">
                                                    info@morenahotels.com
                                                </a>
                                            </div>

                                            <div className="flex gap-4 mt-6">
                                                <a className="text-gray-600 dark:text-gray-400 hover:text-[#007BFF] transition-colors" href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                                    <Facebook className="w-6 h-6" />
                                                </a>
                                                <a className="text-gray-600 dark:text-gray-400 hover:text-[#007BFF] transition-colors" href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                                    <Instagram className="w-6 h-6" />
                                                </a>
                                                <a className="text-gray-600 dark:text-gray-400 hover:text-[#007BFF] transition-colors" href="https://threads.net" target="_blank" rel="noopener noreferrer">
                                                    <ThreadsIcon />
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-8">
                                        <h2 className="text-2xl font-display font-bold text-[#003366] dark:text-white">Our Locations</h2>
                                        
                                        <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg relative">
                                            <iframe 
                                                src="https://www.google.com/maps/d/u/0/embed?mid=1pyXdKc9v51D1WRtsBkZ7NEpT6vJm0FA&ehbc=2E312F" 
                                                className="w-full border-0 absolute -top-14 left-0 right-0"
                                                style={{ height: 'calc(100% + 56px)' }}
                                                allowFullScreen
                                                loading="lazy"
                                                title="Morena Hotels Locations"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-6">
                                            <div>
                                                <h3 className="text-lg font-bold text-[#003366] dark:text-white mb-1">Morena Weligama</h3>
                                                <p className="text-[#343A40] dark:text-[#F8F9FA]">123 Beach Rd, Weligama, Sri Lanka</p>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-[#003366] dark:text-white mb-1">Morena Midigama</h3>
                                                <p className="text-[#343A40] dark:text-[#F8F9FA]">456 Surf Ave, Midigama, Sri Lanka</p>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-[#003366] dark:text-white mb-1">Morena Ahangama</h3>
                                                <p className="text-[#343A40] dark:text-[#F8F9FA]">789 Palm St, Ahangama, Sri Lanka</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </main>

                    <WebFooter />
                </div>
            </div>
        </div>
    );
};

export default ContactPage;