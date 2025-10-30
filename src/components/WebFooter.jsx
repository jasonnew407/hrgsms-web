import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook } from 'lucide-react';

const ThreadsIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 192 192" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M141.537 88.988a66.667 66.667 0 0 0-2.518-1.143c-1.482-27.307-16.403-42.94-41.457-43.1h-.34c-14.986 0-27.449 6.396-35.12 18.036l13.779 9.452c5.73-8.695 14.113-10.816 21.339-10.816h.229c8.249.069 14.97 2.743 19.409 7.72 3.626 4.06 5.966 9.92 7.134 17.906a86.63 86.63 0 0 0-17.884-1.981c-23.36 0-41.417 11.644-46.94 28.915-2.834 8.874-2.178 17.68 1.828 24.78 4.43 7.856 12.582 12.634 22.16 12.634 9.673 0 17.839-3.984 24.109-11.58 3.725-4.516 6.63-10.066 8.666-16.54 5.135 4.789 8.47 11.303 9.548 19.067.116.847.185 1.701.185 2.564 0 12.63-9.922 23.044-22.115 23.044-12.193 0-22.113-10.413-22.113-23.044 0-1.062.1-2.106.267-3.127-7.656.955-15.125 2.93-22.175 5.84-.35 1.38-.533 2.813-.533 4.287 0 20.378 16.575 36.95 36.954 36.95 20.38 0 36.955-16.572 36.955-36.95 0-20.377-16.575-36.95-36.955-36.95-5.31 0-10.345 1.119-14.9 3.131a37.805 37.805 0 0 1 .433-14.063c3.967-12.422 17.188-20.04 34.267-20.04 7.742 0 15.097.879 21.885 2.61 1.825-6.252 3.036-12.89 3.597-19.806z"/>
    </svg>
);

const WebFooter = () => {
    const socialLinksFooter = (
        <div className="flex gap-4">
            <a className="hover:text-[#007BFF] transition-colors" href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Instagram className="w-6 h-6" />
            </a>
            <a className="hover:text-[#007BFF] transition-colors" href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <Facebook className="w-6 h-6" />
            </a>
            <a className="hover:text-[#007BFF] transition-colors" href="https://threads.net" target="_blank" rel="noopener noreferrer">
                <ThreadsIcon />
            </a>
        </div>
    );

    return (
        <footer className="bg-[#003366] dark:bg-gray-900 text-white">
            <div className="max-w-screen-xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-display text-lg font-bold mb-4">Morena Hotels</h3>
                        <p className="text-sm">Experience luxury and tranquility on the beautiful coasts of Sri Lanka.</p>
                    </div>
                    <div>
                        <h3 className="font-display text-lg font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link className="hover:text-[#007BFF] transition-colors" to="/branches">Branches</Link></li>
                            <li><Link className="hover:text-[#007BFF] transition-colors" to="/service-page">Services</Link></li>
                            <li><Link className="hover:text-[#007BFF] transition-colors" to="/faq-page">FAQ</Link></li>
                            <li><Link className="hover:text-[#007BFF] transition-colors" to="/contact-page">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-display text-lg font-bold mb-4">Contact Us</h3>
                        <ul className="space-y-2 text-sm">
                            <li>Email: info@morenahotels.com</li>
                            <li>Phone: +94 11 123 4567</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-display text-lg font-bold mb-4">Follow Us</h3>
                        {socialLinksFooter}
                        <Link className="mt-6 inline-block bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors w-full text-center" to="/management-portal-login">
                            Staff/Management Portal
                        </Link>
                    </div>
                </div>
            </div>
            <div className="bg-[#002244] dark:bg-black py-4">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-400">
                    © 2025 Morena Hotels. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
};

export default WebFooter;