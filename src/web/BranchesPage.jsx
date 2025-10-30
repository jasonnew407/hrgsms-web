import React from 'react';
import WebHeader from '../components/WebHeader';
import WebFooter from '../components/WebFooter';

const BranchesPage = () => {
    const branches = [
        {
            name: "Morena Weligama",
            description: "Experience the vibrant surf culture and luxurious comfort at our Weligama location. Perfect for those who want to be in the heart of the action.",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB4KFD-sVzOkOOTzdL2Mj7IMpqABPP30wIx7nchH_LxDXps_OI-dWVeSQ6qLTg2sInZvSXcm4yfgfctYMdyQRVfsoq8TcjOilXJz83T-D6Gq2keUkbwS0v-vLVutqvbQSH9yqIO_kTwQdBK44prC6r3yN67ct_vAqV-6faTjG_Mstwc8CKMSpP6HNESzHYjrG7ZXhNt_vt8ddup5vvx45mgyAVhjyU-Z2fJFTPJWCctn2y5DYDbkQMt0FOUbJkKMskCq6-otfgXeg",
            amenities: [
                "Rooftop Yoga Shala",
                "Infinity Pool",
                "Direct Beach Access"
            ],
            imagePosition: "left"
        },
        {
            name: "Morena Midigama",
            description: "Discover tranquility in our lush gardens and enjoy a secluded atmosphere. Your perfect escape for relaxation and rejuvenation.",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB8BS60BJz1b-wtj8sjIVq3pbnL10KR-oCyXPlnoNnT7SL4A876PUDN5adcx3DvQYnuGRGa9PVAccVwUnhlC6M23lKpnm4jw115QCYlKlKXBt3i_iqn7Up_hpUf9V80qbWHtjTHR40FKxaj1YLcktSgIJdSCshxczrOpE_DmLeAXxBQlHcjyrBLGJyuIzNgs0w7nZXQmm-8VtR4gd5n_2GlaS2wTMNNT9zKLyKul_pbJHXhnEk3skp5-4LJdqsPqSTTZo5uQH5o_Q",
            amenities: [
                "Private Balconies",
                "In-House Spa",
                "Farm-to-Table Restaurant"
            ],
            imagePosition: "right"
        },
        {
            name: "Morena Ahangama",
            description: "Immerse yourself in modern design and stay close to advanced surf breaks. The ideal spot for digital nomads and surf enthusiasts.",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0_EAM_SdZjydhxTs6ANAdokNzAJKq4wa-0CHidSY3vuH0aLvi-fCzcqX9EyBvhbBquD40UaDdplq6RryOb6pLDiSvyBQFUGIEpLp4Ub0zTxkTus8vRHPAyQWWqz-o0cq9fbafSBAYKd4-TE9yLD38gX3YmVAuj65NbGGQQT5H887QxV3_8e8oNQKmtJe0gclGkESYCo4aS1evZcuLDyBLbNOyYJDyXihnQWwZefvJuhU6TMoJ_rbbdNA0ky-PFCum2tp5YpsN1g",
            amenities: [
                "Co-working Space",
                "Surfboard Rentals",
                "Ocean View Suites"
            ],
            imagePosition: "left"
        }
    ];

    return (
        <div className="bg-[#F8F9FA] dark:bg-[#101b22] font-body text-[#343A40] dark:text-[#F8F9FA]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Montserrat:wght@400;500;700&display=swap');
                
                .font-display { font-family: 'Playfair Display', serif; }
                .font-body { font-family: 'Montserrat', sans-serif; }
            `}</style>

            <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
                <div className="layout-container flex h-full grow flex-col">
                    {/* Header Component */}
                    <WebHeader />

                    {/* Main Content */}
                    <main className="pt-16 flex-1">
                        <div className="px-4 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
                            <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                                {/* Page Title */}
                                <div className="py-8 md:py-12">
                                    <div className="flex flex-wrap justify-center gap-3 p-4">
                                        <h1 className="text-[#111518] dark:text-white text-3xl md:text-4xl font-display font-bold tracking-tight text-center">
                                            Our Coastal Destinations
                                        </h1>
                                    </div>
                                </div>

                                {/* Branches List */}
                                <div className="space-y-12 md:space-y-16 px-4">
                                    {branches.map((branch, index) => (
                                        <div 
                                            key={index}
                                            className={`grid grid-cols-1 md:grid-cols-2 items-center gap-6 md:gap-8 ${
                                                branch.imagePosition === 'right' ? 'md:flex-row-reverse' : ''
                                            }`}
                                        >
                                            {/* Image */}
                                            <div 
                                                className={`w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg ${
                                                    branch.imagePosition === 'right' ? 'md:order-1' : ''
                                                }`}
                                                style={{ backgroundImage: `url(${branch.image})` }}
                                                role="img"
                                                aria-label={`View of ${branch.name}`}
                                            />

                                            {/* Content */}
                                            <div className={`flex flex-col gap-3 ${
                                                branch.imagePosition === 'right' ? 'md:order-2' : ''
                                            }`}>
                                                <h2 className="text-[#111518] dark:text-white text-2xl md:text-3xl font-display font-bold">
                                                    {branch.name}
                                                </h2>
                                                <p className="text-[#60798a] dark:text-gray-400 text-sm md:text-base font-normal leading-relaxed font-body">
                                                    {branch.description}
                                                </p>
                                                
                                                {/* Amenities */}
                                                <div className="mt-1">
                                                    <h4 className="text-[#111518] dark:text-white font-body font-bold text-base md:text-lg mb-2">
                                                        Key Amenities:
                                                    </h4>
                                                    <ul className="list-disc list-inside space-y-1 text-[#60798a] dark:text-gray-400 font-body text-sm">
                                                        {branch.amenities.map((amenity, idx) => (
                                                            <li key={idx}>{amenity}</li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                {/* Book Button */}
                                                <button className="flex mt-3 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 md:h-12 px-5 md:px-6 bg-[#003366] text-white text-sm md:text-base font-bold leading-normal font-body hover:bg-[#003366]/90 transition-colors w-fit">
                                                    <span className="truncate">Check Availability & Book</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Call to Action Section */}
                                <div className="mt-12 mb-8 p-6 md:p-8 bg-white dark:bg-gray-800/50 rounded-xl text-center">
                                    <h2 className="text-[#111518] dark:text-white text-xl md:text-2xl font-display font-bold mb-3">
                                        Ready to Experience Paradise?
                                    </h2>
                                    <p className="text-[#60798a] dark:text-gray-400 text-sm md:text-base font-body mb-5 max-w-2xl mx-auto">
                                        Each of our coastal destinations offers a unique experience. Whether you're seeking adventure, relaxation, or a bit of both, we have the perfect spot for you.
                                    </p>
                                    <button className="inline-flex items-center justify-center px-6 md:px-8 py-2.5 md:py-3 bg-[#0d93f2] hover:bg-[#0b7ed1] text-white text-sm md:text-base font-bold rounded-lg transition-colors font-body">
                                        Explore All Locations
                                    </button>
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

export default BranchesPage;