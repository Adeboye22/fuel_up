import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black text-gray-800 dark:text-white">
      <div className="flex">
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex-1 md:ml-64 p-4">
          <DashboardHeader isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;