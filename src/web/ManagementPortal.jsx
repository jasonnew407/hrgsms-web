import React, { useEffect, useState } from 'react';
import Header from '../components/HeaderNew';
import Sidebar from '../components/SidebarNew';
import axios from 'axios';

const ManagementPortal = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await axios.get('/api/dashboard',{
          withCredentials: true
        });
        console.log(data);
        alert("You accessed the dashboard successfully! with httpOnly cookie");
      } catch (error) {
        alert('Error fetching data from server: ' + error.message);
      }
    };
    loadData();
  }, []);

  const handleLogout = () => {
    console.log('Logging out...');
  };

  return (
    <div className="flex flex-col h-screen bg-[#f5f7f8] dark:bg-[#0f1923] overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Manrope:wght@200;300;400;500;600;700;800&display=swap');
        body {
          font-family: 'Manrope', sans-serif;
        }
        .font-display { 
          font-family: 'Playfair Display', serif; 
        }
        /* Hide scrollbar but keep functionality */
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Header Component */}
      <Header 
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        isUserMenuOpen={isUserMenuOpen}
        setIsUserMenuOpen={setIsUserMenuOpen}
        handleLogout={handleLogout}
      />

      {/* Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Component */}
        <Sidebar 
          isSidebarExpanded={isSidebarExpanded}
          toggleSidebar={toggleSidebar}
          isMobileSidebarOpen={isMobileSidebarOpen}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
          handleLogout={handleLogout}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 bg-[#f5f7f8] dark:bg-[#0f1923] overflow-y-auto hide-scrollbar">
          <div className="w-full h-full min-h-[calc(100vh-8rem)] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                Page Content Goes Here
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagementPortal;