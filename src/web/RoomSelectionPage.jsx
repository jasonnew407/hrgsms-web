import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Wifi, Bed, Waves, AirVent, Home, Users, X } from 'lucide-react';
import axios from 'axios';
import WebHeader from '../components/WebHeader';
import WebFooter from '../components/WebFooter';

const RoomSelectionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomType, setRoomType] = useState('All Types');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sortBy, setSortBy] = useState('popular');
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get data from location state
  const searchData = location.state || {};
  const { searchCriteria, hotel, availableRooms: initialRooms } = searchData;

  useEffect(() => {
    if (!searchCriteria || !hotel) {
      navigate('/booking-search');
      return;
    }
    
    setFilteredRooms(initialRooms || []);
  }, [searchCriteria, hotel, initialRooms, navigate]);

  const getAmenityIcon = (amenity) => {
    const icons = {
      'Wifi': <Wifi className="w-4 h-4" />,
      'King Bed': <Bed className="w-4 h-4" />,
      'Queen Bed': <Bed className="w-4 h-4" />,
      '2 Queen Beds': <Bed className="w-4 h-4" />,
      'Balcony': <Home className="w-4 h-4" />,
      'Sofa Bed': <Bed className="w-4 h-4" />,
      'Jacuzzi': <Waves className="w-4 h-4" />,
      'Ocean View': <Waves className="w-4 h-4" />,
      'Air Conditioning': <AirVent className="w-4 h-4" />
    };
    return icons[amenity] || <AirVent className="w-4 h-4" />;
  };

  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const applyFilters = async () => {
    if (!searchCriteria || !hotel) return;

    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('hotelId', hotel.hotelId);
      params.append('checkInDate', searchCriteria.checkInDate);
      params.append('checkOutDate', searchCriteria.checkOutDate);
      
      if (roomType && roomType !== 'All Types') {
        params.append('roomType', roomType);
      }
      if (priceMin) {
        params.append('priceMin', priceMin);
      }
      if (priceMax) {
        params.append('priceMax', priceMax);
      }
      if (sortBy && sortBy !== 'popular') {
        params.append('sortBy', sortBy);
      }
      
      selectedAmenities.forEach(amenity => {
        params.append('amenities', amenity);
      });

      const res = await axios.get(`/api/booking/filter-rooms?${params.toString()}`);

      if (res.status >= 200 && res.status < 300) {
        setFilteredRooms(res.data.data.availableRooms);
      }
    } catch (error) {
      console.error('Error filtering rooms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [roomType, priceMin, priceMax, selectedAmenities, sortBy]);

  // ✅ CORRECTED: Handle room selection with hotelId included
  const handleSelectRoom = (room) => {
    const bookingData = {
      selectedRoom: {
        roomId: room.roomId,
        roomTypeId: room.roomTypeId,
        typeName: room.typeName,
        pricePerNight: room.pricePerNight,
        totalPrice: room.totalPrice,
        images: [room.imageUrl],
        amenities: room.amenities,
        maxCapacity: room.maxCapacity,
        description: room.description,
        availableCount: room.availableCount
      },
      searchCriteria: {
        checkInDate: searchCriteria.checkInDate,
        checkOutDate: searchCriteria.checkOutDate,
        adults: searchCriteria.adults,
        children: searchCriteria.children,
        nights: searchCriteria.nights,
        hotelId: hotel.hotelId // ✅ ADDED hotelId
      },
      bookingDetails: {
        checkInDate: searchCriteria.checkInDate,
        checkOutDate: searchCriteria.checkOutDate,
        nights: searchCriteria.nights,
        adults: searchCriteria.adults,
        children: searchCriteria.children,
        totalPrice: room.totalPrice,
        pricePerNight: room.pricePerNight,
        roomType: room.typeName,
        maxOccupancy: room.maxCapacity,
        hotelId: hotel.hotelId // ✅ ADDED hotelId
      }
    };

    // Save to sessionStorage as backup for page refresh
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));

    // Navigate to /booking-final with state
    navigate('/booking-final', { state: bookingData });
  };

  if (!searchCriteria || !hotel) {
    return null;
  }

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
      `}</style>

      <WebHeader />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 mt-16">
        <div className="max-w-7xl mx-auto">
          {/* Search Summary Card */}
          <div className="bg-white dark:bg-gray-800/50 p-4 sm:p-6 rounded-lg shadow-sm mb-6 sm:mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
              <div className="w-full md:w-auto grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center md:text-left">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-normal">Branch</p>
                  <p className="text-[#003366] dark:text-white text-sm sm:text-base font-semibold">
                    {hotel.name}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-normal">Dates</p>
                  <p className="text-[#003366] dark:text-white text-sm sm:text-base font-semibold">
                    {searchCriteria.checkInDate} - {searchCriteria.checkOutDate}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-normal">Guests</p>
                  <p className="text-[#003366] dark:text-white text-sm sm:text-base font-semibold">
                    {searchCriteria.adults} Adults, {searchCriteria.children} Children
                  </p>
                </div>
              </div>
              <Link 
                to="/booking-search"
                className="w-full sm:w-auto px-4 py-2 bg-gray-200 dark:bg-gray-700 text-[#003366] dark:text-white text-sm font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-center"
              >
                Modify Search
              </Link>
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-white dark:bg-gray-800/50 p-4 sm:p-6 rounded-lg shadow-sm mb-6 sm:mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-4">
              {/* Room Type Filter */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
                  Room Type
                </label>
                <div className="relative">
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#007bff] appearance-none pr-8"
                  >
                    <option>All Types</option>
                    <option>Deluxe</option>
                    <option>Standard</option>
                    <option>Family</option>
                    <option>Honeymoon</option>
                  </select>
                  <Bed className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
                  Price Range (/night)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Min"
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#007bff]"
                  />
                  <span className="text-gray-500 dark:text-gray-400">-</span>
                  <input
                    type="text"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Max"
                    className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#007bff]"
                  />
                </div>
              </div>

              {/* Amenities Filter */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
                  Amenities
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Wifi', 'Balcony', 'Ocean View', 'Jacuzzi'].map((amenity) => (
                    <button
                      key={amenity}
                      onClick={() => toggleAmenity(amenity)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        selectedAmenities.includes(amenity)
                          ? 'bg-[#007bff] text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {getAmenityIcon(amenity)}
                      <span>{amenity}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sort By */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                {filteredRooms.length} room{filteredRooms.length !== 1 ? 's' : ''} available
              </p>
              <div className="flex items-center gap-2">
                <span className="text-gray-700 dark:text-gray-300 text-sm font-semibold">
                  Sort by:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#007bff]"
                >
                  <option value="popular">Most Popular</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="capacity">Guest Capacity</option>
                </select>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <svg className="animate-spin h-8 w-8 mx-auto text-[#007bff]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading rooms...</p>
            </div>
          )}

          {/* No Rooms Found */}
          {!isLoading && filteredRooms.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No rooms available matching your criteria.
              </p>
              <button
                onClick={() => {
                  setRoomType('All Types');
                  setPriceMin('');
                  setPriceMax('');
                  setSelectedAmenities([]);
                }}
                className="mt-4 px-6 py-2 bg-[#007bff] text-white rounded-lg hover:bg-[#007bff]/90 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Room Cards Grid */}
          {!isLoading && filteredRooms.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredRooms.map((room) => (
                <div
                  key={room.roomTypeId}
                  className="flex flex-col bg-white dark:bg-gray-800/50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div
                    className="relative w-full aspect-video bg-cover bg-center cursor-pointer"
                    style={{ backgroundImage: `url("${room.imageUrl}")` }}
                    onClick={() => setSelectedRoom(room)}
                  >
                    {room.availableCount > 1 && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {room.availableCount} available
                      </div>
                    )}
                  </div>
                  <div className="p-4 sm:p-5 flex flex-col flex-1">
                    <h3 className="text-[#003366] dark:text-white text-base sm:text-lg font-bold mb-2 sm:mb-3">
                      {room.typeName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-gray-600 dark:text-gray-300 mb-3 sm:mb-4">
                      {room.amenities?.slice(0, 3).map((amenity, index) => (
                        <span key={index} className="flex items-center gap-1 text-xs sm:text-sm">
                          {getAmenityIcon(amenity)}
                          <span>{amenity}</span>
                        </span>
                      ))}
                    </div>
                    <div className="mt-auto">
                      <div className="text-right mb-3 sm:mb-4">
                        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                          ${room.pricePerNight}/night
                        </p>
                        <p className="text-[#003366] dark:text-white text-base sm:text-lg font-semibold">
                          ${room.totalPrice} total
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">
                          {searchCriteria.nights} night{searchCriteria.nights > 1 ? 's' : ''}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedRoom(room)}
                        className="w-full px-4 py-2.5 sm:py-3 bg-[#007bff] text-white text-sm sm:text-base font-bold rounded-lg hover:bg-[#007bff]/90 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <WebFooter />

      {selectedRoom && (
        <RoomDetailsModal
          room={selectedRoom}
          searchCriteria={searchCriteria}
          hotel={hotel}
          onClose={() => setSelectedRoom(null)}
          onSelectRoom={handleSelectRoom}
        />
      )}
    </div>
  );
};

// Room Details Modal Component
const RoomDetailsModal = ({ room, searchCriteria, hotel, onClose, onSelectRoom }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const roomImages = [
    room.imageUrl,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC1zGFRhUau9hzCuCgbJVBXVAGmRXCtvoebEyT1WzsrBfKk4JhbCM-y_HWzHK6ZDi2RychxJB5SnpyNPSh8do4R0LspSr7HEVlMfSbY3WUpLPKUZDbXR2xNWT141lSBegLwE9uPzzFVVyWIun8jKrm5i7yj1bOM-HYxDYfkbG57axKc1jQQCtq-6rCR2M2YvxfeKkOEOPEr429mrlKftdcI5r-li6g8SPsztYbmeKuRzIDimQTbNSVhnkGIf5gBLNNkGhbSQMoJ1Q',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAu2Wf8ZyA2r8LZP2a81yXBXNz3kSUZJ7zA45vQuhMKo_kRzYiM-Ky8GS6gSicifmIn7tQit0qf3s6OfAyRRksjgGNgV9CeJ4jbyw1OH5nF5-jE5zgJz7rybCevYSEaSd-QlvrPRlUVyuIMPs3IKlwMcX1JxmqXwNUoBlY4lP8Li18mKwWKGLGy1tY6FFMkRc-OBBQhb1WXZXrva7cBfE4dn_4XbifhFVO9fVMUefskaUNSrKxs-hYol619fBwgj2Nm3dNZGslTkQ',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBWf0xIBl_rXGcmdUSLpGEAxq6g_oFPxXKIsf3d3dmDzIdU6MPb-QffpOkRMAqRyzrhQqF3dsujU5g9bTZGhLHCXQbYG4g-hc8XB-ZkeSkgFSd4y5Cqwo63r7QuYdDfolloLecO00x0TgjKAQtRO2ngFO6S7RTQAM0YU-qGLgjX_XSNb_jP0Xn-qt8dX4S55899rOgrf9i2zD771H77hfUJFpJj_XaTl8aEedrKfDqDpwj9FkQmaI1ukF_ZvAjiKoBwY7GkSh2YDw'
  ];

  const amenitiesDetails = room.amenities?.map(amenity => {
    let icon;
    const amenityLower = amenity.toLowerCase();
    
    if (amenityLower.includes('wifi') || amenityLower.includes('wi-fi')) {
      icon = <Wifi className="w-5 h-5" />;
    } else if (amenityLower.includes('bed')) {
      icon = <Bed className="w-5 h-5" />;
    } else if (amenityLower.includes('balcony') || amenityLower.includes('home')) {
      icon = <Home className="w-5 h-5" />;
    } else if (amenityLower.includes('jacuzzi') || amenityLower.includes('ocean') || amenityLower.includes('view')) {
      icon = <Waves className="w-5 h-5" />;
    } else if (amenityLower.includes('air') || amenityLower.includes('conditioning') || amenityLower.includes('ac')) {
      icon = <AirVent className="w-5 h-5" />;
    } else {
      icon = <Home className="w-5 h-5" />;
    }
    
    return {
      icon: icon,
      label: amenity
    };
  }) || [];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#0f1923] rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors z-10 bg-white dark:bg-gray-800 rounded-full p-2"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image Gallery */}
          <div className="p-4 md:p-6">
            <div
              className="bg-cover bg-center flex flex-col justify-end overflow-hidden rounded-lg h-64 sm:h-80"
              style={{
                backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 25%), url("${roomImages[currentImageIndex]}")`
              }}
            >
              <div className="flex justify-center gap-2 p-5">
                {roomImages.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full cursor-pointer transition-opacity ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white opacity-50'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2">
              {roomImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Room detail ${index + 1}`}
                  className={`w-full h-16 object-cover rounded-md cursor-pointer transition-all ${
                    index === currentImageIndex
                      ? 'border-2 border-[#389cfa]'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Room Info & Booking */}
          <div className="p-4 md:p-6 flex flex-col">
            <div className="flex-grow">
              <h2 className="text-[#111518] dark:text-white text-2xl sm:text-3xl md:text-4xl font-black leading-tight mb-3">
                {room.typeName}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-normal mb-6">
                {room.description || 'Experience luxury and comfort in this beautifully appointed room.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4">
                {amenitiesDetails.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-[#111518] dark:text-gray-300">{amenity.icon}</span>
                    <h3 className="text-[#111518] dark:text-gray-300 text-sm font-bold">
                      {amenity.label}
                    </h3>
                  </div>
                ))}
                <div className="flex items-center gap-3">
                  <span className="text-[#111518] dark:text-gray-300"><Users className="w-5 h-5" /></span>
                  <h3 className="text-[#111518] dark:text-gray-300 text-sm font-bold">
                    Max Occupancy: {room.maxCapacity}
                  </h3>
                </div>
              </div>
            </div>

            <div className="mt-auto">
              <div className="border-t border-gray-200 dark:border-gray-700 py-4">
                <div className="flex justify-between items-center py-2">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Price Per Night</p>
                  <p className="text-[#111518] dark:text-white text-sm font-bold">
                    ${room.pricePerNight}
                  </p>
                </div>
                <div className="flex justify-between items-center py-2">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Total Price ({searchCriteria.nights} Night{searchCriteria.nights > 1 ? 's' : ''})
                  </p>
                  <p className="text-[#111518] dark:text-white text-sm font-bold">
                    ${room.totalPrice}
                  </p>
                </div>
                {room.availableCount > 1 && (
                  <div className="flex justify-between items-center py-2">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Available Rooms</p>
                    <p className="text-green-600 dark:text-green-400 text-sm font-bold">
                      {room.availableCount} rooms
                    </p>
                  </div>
                )}
              </div>

              <button 
                onClick={() => onSelectRoom(room)}
                className="w-full py-3 bg-[#389cfa] text-white text-base font-bold rounded-lg hover:bg-[#389cfa]/90 transition-colors"
              >
                Select Room & Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomSelectionPage;
