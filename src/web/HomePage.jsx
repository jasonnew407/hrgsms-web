import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import WebHeader from '../components/WebHeader';
import WebFooter from '../components/WebFooter';


const HomePage = () => {
    const [lightboxImage, setLightboxImage] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    const heroSlides = [
        {
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_hOA6vX5wgE2MR69TLkz6eVPOAQlH-QvUgsSrAplXEuwvYjZdqpBQT8v-KPhZuUyS3Ok7nu6l2at5lpENmvwYLWNIG8cT685uOL-jL-Llvz8-p_kCzaK5TlYygnHMVQdMlP4abDbPAV4W2ojNShwrkSUcB5r5lhCocmEaOK3ev4VjAnjpCd_wqdQ1qAMJnGGKcuVKzN8q4uKKgvH228r5dKAjpBedt9lrWBMScatFWDJoKtGs-y9Gbh_w9P3n3Gpaf9DwhVhi6g",
            title: "Your Coastal Escape Awaits.",
            subtitle: "Experience the ultimate luxury at our stunning coastal resorts in Sri Lanka."
        },
        {
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAI0EOf7PTOMaXZ5-f4I7tNs94ce6G-Jw2vrZmngbxIIUFvUFKAluoXIN-E-trL2HjbqMYFDhgNJfLMzH5BN3onkc1HGYWE84QrhKDU-d6ypD-GB-p6Wk9T4fztHi8kEExODXC4n970FyvNITC4vD-GFoiuPo2gh__5VttRf5kMxyHhZoLU90RsH2gfgIwvTDjp5OC-uRwfF38S4J74VOdfxUQwoBPyUmH5KTrcIUFllS7bTQUzZNaFroJQrJD6TsEBA5UOb9s74w",
            title: "Discover Paradise.",
            subtitle: "Unwind in luxurious suites with breathtaking ocean views."
        },
        {
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB41dXUFc6P5THLY7DuXmH3saksC7_thijt8rbVM7olv7cBitcANMNBrRaEBz4VM3Bcm25ik_ZKsUONP0V6iblZ3UqnTsM8nRwGffPhC3LkLKCQsI7rQj31YThA3P7QKD2O1BD5uLZpe_kx4q6Lj5gdMhI9Q7GeN_p8pxqREqV_15vZ1qXhAAmZA1I1pVN2PZNJeVQQ6odvW6U30_n_5gwyJx8FuvczimCKduHuaBs9xC7wZ885qkRK2vH8pHQhqaoFb_yEuMvuSw",
            title: "Pristine Beaches Await.",
            subtitle: "Immerse yourself in crystal-clear waters and golden sands."
        },
        {
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtBLpT8CD48a5WYM-GxjyHBQrr9Yb88-805sUKBHNLCdfAB9fquzCAPx3iAtuigkZkAKrxBxTaaxb36LFGZ0VG3lkdd7wfhBP_ZcbG_nnsvI13gBqgEKzu36A_-j19ojanjyNBnjO3yMSXxlJDXZNrjlioWsoqO24C1QTTR-iPcR_OSN6DW-OQu_SxjCNJZ_fwWhXm4hqbwlcKRppcwn11S7chtwtZ317fn7npFBvSQC6GEHrT2TmG1eFPHFYSQrAEKeZ1n378QQ",
            title: "Luxury Redefined.",
            subtitle: "Experience world-class hospitality and unforgettable moments."
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [heroSlides.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    };

    return (
        <div className="bg-[#F8F9FA] dark:bg-[#101b22] font-body text-[#343A40] dark:text-[#F8F9FA]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lato:wght@400;700&display=swap');
                
                .font-display { font-family: 'Playfair Display', serif; }
                .font-body { font-family: 'Lato', sans-serif; }
                
                .lightbox-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                }
                
                .lightbox-overlay img {
                    max-width: 90%;
                    max-height: 90%;
                    object-fit: contain;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.8s ease-out;
                }
            `}</style>

            <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
                <div className="layout-container flex h-full grow flex-col">
                    {/* Header Component */}
                    <WebHeader />

                    <main className="pt-16">
                        {/* Hero Carousel Section */}
                        <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
                            {/* Slides */}
                            {heroSlides.map((slide, index) => (
                                <div
                                    key={index}
                                    className={`absolute inset-0 transition-opacity duration-1000 ${
                                        index === currentSlide ? 'opacity-100' : 'opacity-0'
                                    }`}
                                    style={{
                                        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%), url('${slide.image}')`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                >
                                    <div className="flex items-center justify-center text-center text-white h-full">
                                        <div className="z-10 px-4">
                                            <h1 className="font-display text-5xl md:text-7xl font-bold mb-4 animate-fadeIn">
                                                {slide.title}
                                            </h1>
                                            <h2 className="font-body text-lg md:text-xl mb-8 max-w-2xl mx-auto animate-fadeIn">
                                                {slide.subtitle}
                                            </h2>
                                            <a 
                                                className="inline-block bg-[#007BFF] text-white font-bold py-3 px-8 rounded-lg text-lg uppercase tracking-wider hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg" 
                                                href="https://gentle-tree-0f9c8991e.3.azurestaticapps.net/booking-search"
                                            >
                                                BOOK NOW
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Navigation Arrows */}
                            <button
                                onClick={prevSlide}
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all"
                                aria-label="Previous slide"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all"
                                aria-label="Next slide"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>

                            {/* Dots Indicator */}
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                                {heroSlides.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentSlide(index)}
                                        className={`w-3 h-3 rounded-full transition-all ${
                                            index === currentSlide 
                                                ? 'bg-white w-8' 
                                                : 'bg-white/50 hover:bg-white/75'
                                        }`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Locations Section */}
                        <section className="py-20 bg-[#F8F9FA] dark:bg-[#101b22]">
                            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                                <h2 className="text-4xl font-display font-bold text-center text-[#003366] dark:text-white mb-12">Our Exquisite Locations</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                                        <img className="w-full h-56 object-cover" alt="Luxury hotel room with ocean view in Galle" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAI0EOf7PTOMaXZ5-f4I7tNs94ce6G-Jw2vrZmngbxIIUFvUFKAluoXIN-E-trL2HjbqMYFDhgNJfLMzH5BN3onkc1HGYWE84QrhKDU-d6ypD-GB-p6Wk9T4fztHi8kEExODXC4n970FyvNITC4vD-GFoiuPo2gh__5VttRf5kMxyHhZoLU90RsH2gfgIwvTDjp5OC-uRwfF38S4J74VOdfxUQwoBPyUmH5KTrcIUFllS7bTQUzZNaFroJQrJD6TsEBA5UOb9s74w" />
                                        <div className="p-6">
                                            <h3 className="text-2xl font-display font-bold text-[#003366] dark:text-white mb-2">Morena Midigama</h3>
                                            <p className="text-[#343A40] dark:text-[#F8F9FA] mb-4">Discover the charm of the historic Galle Fort and unwind in our luxurious suites.</p>
                                            <a className="font-bold text-[#007BFF] hover:underline" href="#">Explore Branch</a>
                                        </div>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                                        <img className="w-full h-56 object-cover" alt="Pristine beach with clear water in Trincomalee" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB41dXUFc6P5THLY7DuXmH3saksC7_thijt8rbVM7olv7cBitcANMNBrRaEBz4VM3Bcm25ik_ZKsUONP0V6iblZ3UqnTsM8nRwGffPhC3LkLKCQsI7rQj31YThA3P7QKD2O1BD5uLZpe_kx4q6Lj5gdMhI9Q7GeN_p8pxqREqV_15vZ1qXhAAmZA1I1pVN2PZNJeVQQ6odvW6U30_n_5gwyJx8FuvczimCKduHuaBs9xC7wZ885qkRK2vH8pHQhqaoFb_yEuMvuSw" />
                                        <div className="p-6">
                                            <h3 className="text-2xl font-display font-bold text-[#003366] dark:text-white mb-2">Morena Weligama</h3>
                                            <p className="text-[#343A40] dark:text-[#F8F9FA] mb-4">Immerse yourself in the pristine beaches and vibrant marine life of Weligama.</p>
                                            <a className="font-bold text-[#007BFF] hover:underline" href="#">Explore Branch</a>
                                        </div>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                                        <img className="w-full h-56 object-cover" alt="Sunset view with infinity pool in Mirissa" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtBLpT8CD48a5WYM-GxjyHBQrr9Yb88-805sUKBHNLCdfAB9fquzCAPx3iAtuigkZkAKrxBxTaaxb36LFGZ0VG3lkdd7wfhBP_ZcbG_nnsvI13gBqgEKzu36A_-j19ojanjyNBnjO3yMSXxlJDXZNrjlioWsoqO24C1QTTR-iPcR_OSN6DW-OQu_SxjCNJZ_fwWhXm4hqbwlcKRppcwn11S7chtwtZ317fn7npFBvSQC6GEHrT2TmG1eFPHFYSQrAEKeZ1n378QQ" />
                                        <div className="p-6">
                                            <h3 className="text-2xl font-display font-bold text-[#003366] dark:text-white mb-2">Morena Ahangama</h3>
                                            <p className="text-[#343A40] dark:text-[#F8F9FA] mb-4">Experience the thrill of whale watching and the laid-back vibe of Ahangama.</p>
                                            <a className="font-bold text-[#007BFF] hover:underline" href="#">Explore Branch</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Gallery Section */}
                        <section className="py-20">
                            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                                <h2 className="text-4xl font-display font-bold text-center text-[#003366] dark:text-white mb-12">A Glimpse into Paradise</h2>
                                <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                                    <button onClick={() => setLightboxImage("https://lh3.googleusercontent.com/aida-public/AB6AXuAAeFc7WGS1X8pKB-uy8Wgg2Lq_6y52NNZOsaC637_hk5fNyMvr867PDnaDPojVd2wi9CwXrWkFqYGA8a2wt3AIlWvbkLSTb2xWDxFVexSOyPZdG-NC968g5hV5u3unxH8pbPGJgzX5hrFPBEcm6WycWLVkzLszDnSAzeVv4vnMxHnyTElClcz_2gWOJwgk7rl4fdktdF67YLqliEla9rn_gaZYguSP1wdZMyvvByoXbKijbJclmCshHS5q-Ni-srbOchqBshAGQA")} className="block group w-full">
                                        <img className="rounded-lg shadow-md w-full transition-transform duration-300 transform group-hover:scale-105" alt="Infinity pool overlooking the ocean" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAeFc7WGS1X8pKB-uy8Wgg2Lq_6y52NNZOsaC637_hk5fNyMvr867PDnaDPojVd2wi9CwXrWkFqYGA8a2wt3AIlWvbkLSTb2xWDxFVexSOyPZdG-NC968g5hV5u3unxH8pbPGJgzX5hrFPBEcm6WycWLVkzLszDnSAzeVv4vnMxHnyTElClcz_2gWOJwgk7rl4fdktdF67YLqliEla9rn_gaZYguSP1wdZMyvvByoXbKijbJclmCshHS5q-Ni-srbOchqBshAGQA" />
                                    </button>
                                    <button onClick={() => setLightboxImage("https://lh3.googleusercontent.com/aida-public/AB6AXuCpRavAf9GhSpQ86zUcakAN24JNqiM_QrvJSCx_FObKB_E_Af3vrDvWeeJooQOyg-dbb_D_Y8g-EPmqca7N8rCoyofZyRp-zRcJCzXsZkL6fZLIrvMT9aCqih_EfewygJcC5HWuta2auwCoOn_CZk5teZGjW_JUfRZl22cnPScG3D9vrSE8KibNbaSNyRRqTB1zip83PXcxehU6oUjCi3DOjClKo9CTOcSWjH_cudko5M47C1sWhNFrvLRtaLGA2BQaqjVrQOmMDw")} className="block group w-full">
                                        <img className="rounded-lg shadow-md w-full transition-transform duration-300 transform group-hover:scale-105" alt="Aerial view of the resort" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpRavAf9GhSpQ86zUcakAN24JNqiM_QrvJSCx_FObKB_E_Af3vrDvWeeJooQOyg-dbb_D_Y8g-EPmqca7N8rCoyofZyRp-zRcJCzXsZkL6fZLIrvMT9aCqih_EfewygJcC5HWuta2auwCoOn_CZk5teZGjW_JUfRZl22cnPScG3D9vrSE8KibNbaSNyRRqTB1zip83PXcxehU6oUjCi3DOjClKo9CTOcSWjH_cudko5M47C1sWhNFrvLRtaLGA2BQaqjVrQOmMDw" />
                                    </button>
                                    <button onClick={() => setLightboxImage("https://lh3.googleusercontent.com/aida-public/AB6AXuCI52m_UYJRC_AtYvATiS96sNEZMpz1l5iX_hRLEMmw8b81GOIt-ostRtx9cc74sqPEnMvg52RkrJLQi0Dn4KOfW300e4BfFSWERn8UnW-dP4fAjjdVgneWgwOn0bmtnNVbITDxP02xrx-AFGWXsTvAwhZOPLBOyslxX7G7SIaqiMUzv_TKtS0E7EyabXnedfc41QHPXx3_fJMYK-r3TrOUDSqoif_eOtdartnbZpFPhPAuF_42oS8com_f_8cJeeKRlHhJDYyNjQ")} className="block group w-full">
                                        <img className="rounded-lg shadow-md w-full transition-transform duration-300 transform group-hover:scale-105" alt="Luxurious hotel bedroom" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCI52m_UYJRC_AtYvATiS96sNEZMpz1l5iX_hRLEMmw8b81GOIt-ostRtx9cc74sqPEnMvg52RkrJLQi0Dn4KOfW300e4BfFSWERn8UnW-dP4fAjjdVgneWgwOn0bmtnNVbITDxP02xrx-AFGWXsTvAwhZOPLBOyslxX7G7SIaqiMUzv_TKtS0E7EyabXnedfc41QHPXx3_fJMYK-r3TrOUDSqoif_eOtdartnbZpFPhPAuF_42oS8com_f_8cJeeKRlHhJDYyNjQ" />
                                    </button>
                                    <button onClick={() => setLightboxImage("https://lh3.googleusercontent.com/aida-public/AB6AXuCuLheE6dNtZ73v1wawiMWFTClwwYcBAcn1dVR3DeBSn-hzwqqtz0GTwXAY6nXv63alX6NB5cOeP56DfUSsI3qid_dCt6ltxwj4zi3ZV9zfiwnvy5l0cRp6O9pVMc30vage0aj8B4lyuQyvmVwcq4-gGn7HtnupawPBSsALVVHVeBhKhh-BIZXJ0UVb1ASRvY0C6DglY2fkAvqYWcuTzcBhdH2TpPe4mI5ZZaAXw5S12gw7p-xh-TqSleNuRr1N7adkF0yiTOg5Ww")} className="block group w-full">
                                        <img className="rounded-lg shadow-md w-full transition-transform duration-300 transform group-hover:scale-105" alt="Couple enjoying breakfast by the pool" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuLheE6dNtZ73v1wawiMWFTClwwYcBAcn1dVR3DeBSn-hzwqqtz0GTwXAY6nXv63alX6NB5cOeP56DfUSsI3qid_dCt6ltxwj4zi3ZV9zfiwnvy5l0cRp6O9pVMc30vage0aj8B4lyuQyvmVwcq4-gGn7HtnupawPBSsALVVHVeBhKhh-BIZXJ0UVb1ASRvY0C6DglY2fkAvqYWcuTzcBhdH2TpPe4mI5ZZaAXw5S12gw7p-xh-TqSleNuRr1N7adkF0yiTOg5Ww" />
                                    </button>
                                    <button onClick={() => setLightboxImage("https://lh3.googleusercontent.com/aida-public/AB6AXuBapb1BGfzsWEFPdvTNYPHjM4Sqa-CvJGimwD_Rg4-GqMfjZVFrlniRnBBnQeuSx4N10TsNoMwJ_QznhqaOnRhddJciWY53dbTa2Tg2Udo1WsI3VtJf2YNZWf1xtZjyicDXvirHlycMzmVEigUo28UA5rZsT0481OwpHQtZRv6VfyWeNf6vvqamhF0S7v1YgeeqDVy21tDr1mYbkr0xXUWJTr682Dcn7lB5focCvu-PjB01jEeM9fcVz2JSWkUxeEc4BlEhlJV-lw")} className="block group w-full">
                                        <img className="rounded-lg shadow-md w-full transition-transform duration-300 transform group-hover:scale-105" alt="Resort restaurant with outdoor seating" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBapb1BGfzsWEFPdvTNYPHjM4Sqa-CvJGimwD_Rg4-GqMfjZVFrlniRnBBnQeuSx4N10TsNoMwJ_QznhqaOnRhddJciWY53dbTa2Tg2Udo1WsI3VtJf2YNZWf1xtZjyicDXvirHlycMzmVEigUo28UA5rZsT0481OwpHQtZRv6VfyWeNf6vvqamhF0S7v1YgeeqDVy21tDr1mYbkr0xXUWJTr682Dcn7lB5focCvu-PjB01jEeM9fcVz2JSWkUxeEc4BlEhlJV-lw" />
                                    </button>
                                    <button onClick={() => setLightboxImage("https://lh3.googleusercontent.com/aida-public/AB6AXuBKGUw_bk9_mAxUhcZA-faP00-VlCLDtBOxtXqGvrGPZLCcpiEEM8nvm9ihTRS7ly_beRvB26Ivs8CO4inq6gMQ_UJ_a4L4_9Sg2x8ZvN-dn9lkhA_16bt6gDW-qWUn8-rMDNWFCq8aB765hy3jZzzH-Yz90niP1P9J0JUPIJWHQqDqYMgePj-eJ-2vYePc7oWsfgE-ZivfWmAFrI2UlTG5zEUAfVjWm94NvnC2U1xXLWA7zM-pKd7S8QpQ4-lsl6CVplZ9MSpARw")} className="block group w-full">
                                        <img className="rounded-lg shadow-md w-full transition-transform duration-300 transform group-hover:scale-105" alt="Spa and wellness center" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKGUw_bk9_mAxUhcZA-faP00-VlCLDtBOxtXqGvrGPZLCcpiEEM8nvm9ihTRS7ly_beRvB26Ivs8CO4inq6gMQ_UJ_a4L4_9Sg2x8ZvN-dn9lkhA_16bt6gDW-qWUn8-rMDNWFCq8aB765hy3jZzzH-Yz90niP1P9J0JUPIJWHQqDqYMgePj-eJ-2vYePc7oWsfgE-ZivfWmAFrI2UlTG5zEUAfVjWm94NvnC2U1xXLWA7zM-pKd7S8QpQ4-lsl6CVplZ9MSpARw" />
                                    </button>
                                    <button onClick={() => setLightboxImage("https://lh3.googleusercontent.com/aida-public/AB6AXuAMcaiqSh1GX2Ikzzft8XBJ3OUIO7G7bjfpdpmrX-QX6Qy9i7CyUDDAIOglJoN3h5XkcLH0sHJtAx6QcAjq_OuWi1C8v_vcfHpRfpmhcRrrIZUiSUCS9UPUCEXSwMX7-aa3-MhsDDnhEv12_dF86nXaNgGI9X6PHEd1IqFNc9D1v7MW0hRPoRMRo8qt_UHFGvBi_vRhR04OFjmaP-1kuE44CpBy9CcjHm7lvoLJpTK4GL-zgvFS0xXWb2sV-4fWvL_oTZwxSw_I-w")} className="block group w-full">
                                        <img className="rounded-lg shadow-md w-full transition-transform duration-300 transform group-hover:scale-105" alt="Local scenery near the hotel" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMcaiqSh1GX2Ikzzft8XBJ3OUIO7G7bjfpdpmrX-QX6Qy9i7CyUDDAIOglJoN3h5XkcLH0sHJtAx6QcAjq_OuWi1C8v_vcfHpRfpmhcRrrIZUiSUCS9UPUCEXSwMX7-aa3-MhsDDnhEv12_dF86nXaNgGI9X6PHEd1IqFNc9D1v7MW0hRPoRMRo8qt_UHFGvBi_vRhR04OFjmaP-1kuE44CpBy9CcjHm7lvoLJpTK4GL-zgvFS0xXWb2sV-4fWvL_oTZwxSw_I-w" />
                                    </button>
                                    <button onClick={() => setLightboxImage("https://lh3.googleusercontent.com/aida-public/AB6AXuC7JVP9K72BWXAMv8WkTKk4VGySsJfCl1l_Z1l2iOGlAEmOGNaUJ6htq-M5QAW9wi2eACFyAW3W5tS33qE4IUg8A60ODhN2tabukdYKH7n_5AWe2jX18AE32T4-6ydiJxjlaibg4aRtRSWW1328_g4cyJtpe4hiv4zMRnxorEN3Ca2wHbDCe41D2xFBl2KLsWor7hKI0p3Rey5PAvor7_tZYAs3qSYsKIySQcYExTQoVbxLbOoc7ntEs9hKziyUxmiPEWmivoNwVw")} className="block group w-full">
                                        <img className="rounded-lg shadow-md w-full transition-transform duration-300 transform group-hover:scale-105" alt="Clean and modern hotel bathroom" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7JVP9K72BWXAMv8WkTKk4VGySsJfCl1l_Z1l2iOGlAEmOGNaUJ6htq-M5QAW9wi2eACFyAW3W5tS33qE4IUg8A60ODhN2tabukdYKH7n_5AWe2jX18AE32T4-6ydiJxjlaibg4aRtRSWW1328_g4cyJtpe4hiv4zMRnxorEN3Ca2wHbDCe41D2xFBl2KLsWor7hKI0p3Rey5PAvor7_tZYAs3qSYsKIySQcYExTQoVbxLbOoc7ntEs9hKziyUxmiPEWmivoNwVw" />
                                    </button>
                                </div>
                            </div>
                        </section>
                    </main>

                    {/* Footer Component */}
                    <WebFooter />
                </div>
            </div>

            {/* Lightbox */}
            {lightboxImage && (
                <div className="lightbox-overlay" onClick={() => setLightboxImage(null)}>
                    <img src={lightboxImage} alt="Gallery" />
                </div>
            )}
        </div>
    );
};

export default HomePage;
