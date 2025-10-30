import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import HeaderNew from '../components/HeaderNew';
import Sidebar from '../components/SidebarNew';

const AdminDashboard = () => {
  // Sidebar & UI State
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Dashboard Data State
  const [dashboardData] = useState({
    stats: {
      revenue: { value: '$1,250,450', change: '+5.2%', trend: 'up' },
      users: { value: '542', change: '+1.8%', trend: 'up' },
      branches: { value: '15', change: '+0%', trend: 'neutral' },
      rooms: { value: '2,800', change: '+0%', trend: 'neutral' }
    },
    activities: [
      {
        id: 1,
        action: "User 'john.doe' password reset",
        actor: 'Admin (You)',
        timestamp: '2024-07-29 10:45 AM'
      },
      {
        id: 2,
        action: "New Branch 'Seaside Resort' created",
        actor: 'Admin (You)',
        timestamp: '2024-07-29 09:30 AM'
      },
      {
        id: 3,
        action: 'System backup completed successfully',
        actor: 'SYSTEM',
        timestamp: '2024-07-29 02:00 AM'
      }
    ],
    usersByRole: [
      { name: 'Admin', value: 12, color: '#ef4444' },
      { name: 'Manager', value: 45, color: '#fbbf24' },
      { name: 'Staff', value: 485, color: '#3b82f6' }
    ]
  });

  // Revenue Chart Data
  const [revenueData] = useState([
    { date: 'Week 1', revenue: 245000 },
    { date: 'Week 2', revenue: 280000 },
    { date: 'Week 3', revenue: 310000 },
    { date: 'Week 4', revenue: 415450 }
  ]);

  // Rooms per Branch Data
  const [roomsData] = useState([
    { branch: 'Central', rooms: 450 },
    { branch: 'Seaside', rooms: 380 },
    { branch: 'Airport', rooms: 520 },
    { branch: 'North', rooms: 420 },
    { branch: 'Downtown', rooms: 490 },
    { branch: 'Beach', rooms: 340 }
  ]);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  useEffect(() => {
    // Fetch dashboard data
  }, []);

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 shadow-lg">
          <p className="text-xs font-semibold text-gray-900 dark:text-white">
            {payload[0].payload.date}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
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
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .recharts-text {
          fill: #6b7280;
        }
        .dark .recharts-text {
          fill: #9ca3af;
        }
        .recharts-cartesian-grid-horizontal line,
        .recharts-cartesian-grid-vertical line {
          stroke: #e5e7eb;
        }
        .dark .recharts-cartesian-grid-horizontal line,
        .dark .recharts-cartesian-grid-vertical line {
          stroke: #374151;
        }
      `}</style>

      <HeaderNew 
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        isUserMenuOpen={isUserMenuOpen}
        setIsUserMenuOpen={setIsUserMenuOpen}
        handleLogout={handleLogout}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isSidebarExpanded={isSidebarExpanded}
          toggleSidebar={toggleSidebar}
          isMobileSidebarOpen={isMobileSidebarOpen}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
          handleLogout={handleLogout}
        />

        <main className="flex-1 p-3 sm:p-4 md:p-5 bg-[#f5f7f8] dark:bg-[#0f1923] overflow-y-auto hide-scrollbar">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-4 sm:mb-5">
              <h1 className="text-xl sm:text-2xl font-black leading-tight tracking-[-0.033em] text-[#111518] dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                Welcome back, System Administrator.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-5">
              {/* Total Revenue */}
              <div className="flex flex-col gap-1.5 rounded-lg p-3 sm:p-4 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400 text-xs font-medium">
                  Total Revenue (30d)
                </p>
                <p className="text-[#111518] dark:text-white text-lg sm:text-xl font-bold">
                  {dashboardData.stats.revenue.value}
                </p>
                <div className="flex items-center gap-1 text-green-600 dark:text-green-500 text-xs font-medium">
                  <TrendingUp className="w-3 h-3" />
                  <span>{dashboardData.stats.revenue.change}</span>
                </div>
              </div>

              {/* Total Active Users */}
              <div className="flex flex-col gap-1.5 rounded-lg p-3 sm:p-4 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400 text-xs font-medium">
                  Active Users
                </p>
                <p className="text-[#111518] dark:text-white text-lg sm:text-xl font-bold">
                  {dashboardData.stats.users.value}
                </p>
                <div className="flex items-center gap-1 text-green-600 dark:text-green-500 text-xs font-medium">
                  <TrendingUp className="w-3 h-3" />
                  <span>{dashboardData.stats.users.change}</span>
                </div>
              </div>

              {/* Managed Branches */}
              <div className="flex flex-col gap-1.5 rounded-lg p-3 sm:p-4 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400 text-xs font-medium">
                  Branches
                </p>
                <p className="text-[#111518] dark:text-white text-lg sm:text-xl font-bold">
                  {dashboardData.stats.branches.value}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                  {dashboardData.stats.branches.change}
                </p>
              </div>

              {/* Total Rooms */}
              <div className="flex flex-col gap-1.5 rounded-lg p-3 sm:p-4 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400 text-xs font-medium">
                  Total Rooms
                </p>
                <p className="text-[#111518] dark:text-white text-lg sm:text-xl font-bold">
                  {dashboardData.stats.rooms.value}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                  {dashboardData.stats.rooms.change}
                </p>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
              {/* Left Column */}
              <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-5">
                {/* Activity Table */}
                <div className="bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h2 className="text-sm sm:text-base font-bold text-[#111518] dark:text-white p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
                    Latest Activity
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th scope="col" className="px-3 sm:px-4 py-2">Action</th>
                          <th scope="col" className="px-3 sm:px-4 py-2 hidden sm:table-cell">Actor</th>
                          <th scope="col" className="px-3 sm:px-4 py-2">Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {dashboardData.activities.map((activity) => (
                          <tr key={activity.id} className="text-[#111518] dark:text-gray-200">
                            <td className="px-3 sm:px-4 py-2 font-medium">
                              {activity.action}
                              <span className="sm:hidden block text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                {activity.actor}
                              </span>
                            </td>
                            <td className="px-3 sm:px-4 py-2 text-gray-600 dark:text-gray-300 hidden sm:table-cell">
                              {activity.actor}
                            </td>
                            <td className="px-3 sm:px-4 py-2 text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">
                              {activity.timestamp}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Revenue Chart */}
                <div className="bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 gap-2">
                    <h2 className="text-sm sm:text-base font-bold text-[#111518] dark:text-white">
                      Revenue Summary
                    </h2>
                    <select className="text-xs rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#111518] dark:text-gray-200 focus:border-blue-500 focus:ring-blue-500/50 h-8">
                      <option>Last 7 Days</option>
                      <option>Last 30 Days</option>
                      <option>Last 6 Months</option>
                    </select>
                  </div>
                  <div className="p-3 sm:p-4">
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 11 }}
                          stroke="#9ca3af"
                        />
                        <YAxis 
                          tick={{ fontSize: 11 }}
                          stroke="#9ca3af"
                          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          dot={{ fill: '#3b82f6', r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-1 flex flex-col gap-4 sm:gap-5">
                {/* Users by Role */}
                <div className="bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
                  <h3 className="text-sm sm:text-base font-bold text-[#111518] dark:text-white mb-3">
                    Users by Role
                  </h3>
                  <div className="flex items-center justify-center mb-3">
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie
                          data={dashboardData.usersByRole}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={65}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {dashboardData.usersByRole.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            padding: '6px',
                            fontSize: '12px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    {dashboardData.usersByRole.map((role, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                          <span 
                            className="w-2.5 h-2.5 rounded-full" 
                            style={{ backgroundColor: role.color }}
                          ></span>
                          {role.name}
                        </span>
                        <span className="font-semibold text-[#111518] dark:text-white">
                          {role.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rooms per Branch */}
                <div className="bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4">
                  <h3 className="text-sm sm:text-base font-bold text-[#111518] dark:text-white mb-3">
                    Rooms per Branch
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={roomsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="branch" 
                        tick={{ fontSize: 9 }}
                        angle={-45}
                        textAnchor="end"
                        height={70}
                        stroke="#9ca3af"
                      />
                      <YAxis 
                        tick={{ fontSize: 11 }}
                        stroke="#9ca3af"
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem',
                          padding: '6px',
                          fontSize: '12px'
                        }}
                      />
                      <Bar 
                        dataKey="rooms" 
                        fill="#3b82f6"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
