import React from 'react';
import { MapPin } from 'lucide-react';
import WebHeader from '../components/WebHeader';
import WebFooter from '../components/WebFooter';

const ServicesPage = () => {
    const services = {
        dining: [
            {
                title: "Fine Dining Restaurant",
                description: "Indulge in a world of exquisite flavors at our renowned fine dining restaurant.",
                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzSXTsrA5n3NLQSr44j2TEsIMt42_OQ6rObTTTkzTvyxuN59rL8DRrlPX11btgbaAdewAULg9nX_nCJGzTmkP7K-zNaVG5uI3UDhPnZfX9VXxR42hzH5QSq9wPPu0JMiLw6AaXqc0oxvuZ7xxjMHWbXV_J9KKa_dAbSLMU-b0hFoxACh6--iuLKedWjnoBObzYkMxKOKIUzuEgES8sx6uwfdi0x_03GgYqBn9_zV2Zfa6dkTUc_f_Nyx5OE01JV7hZDasiTQxsjg",
                location: "Available at all locations"
            },
            {
                title: "Rooftop Bar",
                description: "Sip on handcrafted cocktails and enjoy breathtaking city views at our chic rooftop bar.",
                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAUbCFu9bBjkvTAlbIOPSvRPg0R5_TWcSL7DFzPJlIfqFK3BlJRTwdU7N0tU8lBD8Yf2unnMrYkIxGR_m9j0NByQZDQxv1Tyk8ut49uwwisI82gf9-S7wa-OUSLdBVfu0ZPP4fcxP_hUo8UGBBLCwVL2MuZrqtIzaU2IUl3nB4ApuJrrm1-LTq7HzrD6maRFN3WrRFT3hr4xMxpajAuEYAVaznm3WFcCKPzbduzkQWIDQuoNGmXtEY0GHC9O_HWmsOM9qfaFJGHLg",
                location: "Available at select locations"
            },
            {
                title: "In-Room Dining",
                description: "Experience the ultimate convenience and luxury with our 24/7 in-room dining service.",
                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWuSR29-7QshF4xGmy7JvOm6M-W-QddZQK9FLmICquSMrNXVRpVFt8O7A4xbzeKOQyfIE9S9t2E0PrO1DNKGUwhCuZ8C0PTBftKYJF2BFzPsGbtsHM6UyNms0OD9fWiVzewlWvBP8yV0OdifA8T1ryG1b_OiaZxHpOPEIsMQid1ed0JFlkHYchwQvJZhAO483sKrxJtnRT2hcP4fkh9NFZ0t2KNR0iRKK8wlD4opXIrWdDI-briXL313V7L1Ye2EFQo-zwD4wxgg",
                location: "Available at all locations"
            }
        ],
        wellness: [
            {
                title: "Full-Service Spa",
                description: "Rejuvenate your body and soul with our wide range of spa treatments.",
                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8QC6NheHjL8UlhjGqm4zKwTMiItwwcjb_k8Z14BsJpqifz2R9YYu1iLygyN4ail8eSizNGlRrRwhEVsXMkmaK5LJ69VY26vpOA9pRzzezyflqDTbGLMdHGlBwxfNc82hlP1Dl0D1ClEVAQOJw0dksvXL0eKF0IuiGXTh5qjJU5jAfBiK6u9AT1lIigbrZidHoJxRrGyjcwwYTY5D3m-_rbUvOYfIMcRn0dDBdzJ48I1reax8xLrGtPui0tNG9NbY511HacVS-jQ",
                location: "Available at select locations"
            },
            {
                title: "Heated Indoor Pool",
                description: "Take a refreshing dip in our heated indoor pool, perfect for any weather.",
                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZMV5WQC3nGptM0vMf0O0WRxX5l2CP6wBtCNglTi6_DOefLgtn4dLw7K0i3kRPnJ0y1Op97WnIO_TLr4s0kwJCN8c7GH7xKUtLkzs4IV6NF5ToH__AVgiSc7IiN4adA270iMmRqBPx4Ia5tJ3YbtkiIDuQQv0BpC1m-PCJ3ll7oyuVDYImQTko8tghUkZV1O2QyWQMuQStuSa6mEe-sw3o62J-gLH2pSAjeVQCtei7xegdCiUSG4Any9egio5rhuEqtm3A2S0yxA",
                location: "Available at all locations"
            },
            {
                title: "State-of-the-Art Gym",
                description: "Stay active with our fully equipped, state-of-the-art fitness center.",
                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA22dgLVOtEz_Y7GZ-vCZvcj2LpIiTuIAfPKx3Z7NQZwoH2fHq5EuI-EzdCjquxTFK6po5G5sDbp23qRKKZo08QOdCa-cFj8aDwycnVXH46nOhn81ISFarsZipbomfUkpSUFAurlnh0cfPAjWZPTjtZWqTiGNnvWnVjsAlJUd2bK9dUYrvWTtD1uePdy_NZAuaptlr2FZJX-XPPaX9Ed1kzMMIpC2HY9J4k3yz9hKm1afumjkfNKUCpzId7dQoxR7Ydx_smq7V9HA",
                location: "Available at all locations"
            }
        ],
        convenience: [
            {
                title: "Airport Shuttle",
                description: "Enjoy seamless travel with our complimentary airport shuttle service.",
                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHVgKAZXBGLmsPK2gnDCdhH6zdP13wpm_pNWaydjQzBldq2TD2bb7eLrnvNrs6KaiV3Cjdewpq1PXc3L-wdOl1dCCTq7q0jGiqv40NSKTBwwLXlobERzkH0ryTHgwwdLMAxjNIlqaYYDkxVrIW4b__8Dow3xAhyUYx6eueNQIZjpJuRmleFKHtTod8nIs5c3_PuxPmPj6tVUkVp7_Nu6qrVWaABCexdKNpbfVQBpPl30cJHNIiqPryAbUsVzGMNtVn9T8oK41nEQ",
                location: "Available at select locations"
            },
            {
                title: "Concierge Service",
                description: "Our dedicated concierge team is here to assist with all your needs and requests.",
                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC51bQBteD0YehoonP2EWmaULrpLeALw4iCUy8fFqzgR4QQRsceNpYJkbyWM2bzYqv41UNaD0SIxQWuPSCnrYKKGHTM0LfsXViK3mwWD-P2xG8CGyf6HmyqG9IuMLD3dCx7U1u2_gr4Ibmwi2AImK9GcF3kUMCZ3ro67J4vdrbcpNvtVcr9tIx6SXYvzlFzeM5R1s3B8BhfuIg-nFLewEyMqrry0gUFLtgbVC4_cy7n_1KZXQ6pW7d2o0aqGjnjmq78-F-2oldSDQ",
                location: "Available at all locations"
            },
            {
                title: "Valet Parking",
                description: "Experience hassle-free parking with our professional valet service.",
                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDy_KR_so9ci_Aw006kndX4LB0sAbgepzg9KlMlnxHlNg_8HU3NNZgDBpWYS0a07WR2GigV7KtAkxkMMJrCsotxtZPeyJq-YQjKrEfPgR6_nE961fQiDmPrkYm2pVgOV7bQpyV8uL1x5pQrPi8bXD7qoz81MTpL3XS1-fC8F7dwOIRqAEErTbWNHvjMaWCXZcfPxYgJWkzQkk7tcmrkk17FENoA29BpcSkmTEMPv8tM23PXPW8gLE6AgEOTe9sV76R8kqOlpSIcYw",
                location: "Available at select locations"
            }
        ]
    };

    const ServiceCard = ({ service }) => (
        <div className="flex flex-col gap-3 pb-3 group">
            <div 
                className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg overflow-hidden transform transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundImage: `url(${service.image})` }}
            />
            <div>
                <h3 className="text-[#111518] dark:text-white text-base font-medium leading-normal font-manrope">
                    {service.title}
                </h3>
                <p className="text-[#60798a] dark:text-gray-400 text-sm font-normal leading-normal font-manrope">
                    {service.description}
                </p>
                <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4 text-[#60798a] dark:text-gray-400" />
                    <p className="text-[#60798a] dark:text-gray-400 text-xs font-normal leading-normal font-manrope">
                        {service.location}
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-[#F8F9FA] dark:bg-[#101b22] font-body text-[#343A40] dark:text-[#F8F9FA]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Lato:wght@400;700&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap');
                
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
                        <div className="flex justify-center py-5">
                            <div className="flex flex-col max-w-[960px] w-full px-4 sm:px-6 lg:px-8">
                                {/* Page Title */}
                                <div className="flex flex-wrap justify-between gap-3 p-4 py-12">
                                    <h1 className="text-[#111518] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72 font-manrope">
                                        Our Services & Amenities
                                    </h1>
                                </div>

                                {/* Dining & Culinary */}
                                <h2 className="text-[#111518] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 font-manrope">
                                    Dining & Culinary
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                                    {services.dining.map((service, index) => (
                                        <ServiceCard key={index} service={service} />
                                    ))}
                                </div>

                                {/* Wellness & Relaxation */}
                                <h2 className="text-[#111518] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-8 font-manrope">
                                    Wellness & Relaxation
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                                    {services.wellness.map((service, index) => (
                                        <ServiceCard key={index} service={service} />
                                    ))}
                                </div>

                                {/* Convenience & Transport */}
                                <h2 className="text-[#111518] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-8 font-manrope">
                                    Convenience & Transport
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                                    {services.convenience.map((service, index) => (
                                        <ServiceCard key={index} service={service} />
                                    ))}
                                </div>

                                {/* CTA Section */}
                                <div className="w-full flex flex-col items-center justify-center gap-4 p-8 my-10 bg-[#F8F9FA] dark:bg-[#101b22]/50 rounded-xl border border-gray-200 dark:border-gray-700">
                                    <h2 className="text-2xl font-bold text-[#111518] dark:text-white text-center font-manrope">
                                        Ready to Experience It All?
                                    </h2>
                                    <p className="text-center text-[#60798a] dark:text-gray-400 max-w-md font-manrope">
                                        Book your stay at Morena Hotels and indulge in a world of luxury, comfort, and unparalleled service.
                                    </p>
                                    <button className="flex min-w-[120px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 mt-4 bg-[#0d93f2] hover:bg-[#0b7ed1] text-white text-base font-bold leading-normal tracking-[0.015em] transition-colors font-manrope">
                                        <span className="truncate">BOOK NOW</span>
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

export default ServicesPage;