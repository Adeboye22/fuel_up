import React from 'react';
import { motion } from 'framer-motion';
import NotificationBell from './NotificationBell';
import UserAvatar from './UserAvatar';
import { ModeToggle } from '../mode-toggle';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '@/stores/useAuthStore';
import { 
  Menu, 
  X, 
  LogOut,
  Search,
  Bell,
  HelpCircle
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const AdminHeader = ({ toggleSidebar, isSidebarOpen }) => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get page title based on current path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard';
    if (path === '/admin/users') return 'User Management';
    if (path === '/admin/orders') return 'Order Management';
    if (path === '/admin/notifications') return 'Notifications';
    if (path === '/admin/settings') return 'System Settings';
    return 'Admin Portal';
  };

  // Get user's name to display
  const adminName = user?.firstName || 'Admin';
  const adminRole = user?.role || 'System Administrator';

  // Logout handler
  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-between items-center mb-6 z-20 bg-background/90 dark:bg-gray-800/40 backdrop-blur-2xl dark:border-b dark:border-gray-800 border-gray-700/50 rounded-xl px-4 lg:px-8 py-4 sticky top-4 shadow-sm"
    >
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white focus:outline-none transition-colors lg:hidden"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        
        <div className="hidden md:block">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">{getPageTitle()}</h1>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">Welcome, {adminName}</p>
            <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800 font-normal text-xs">{adminRole}</Badge>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Global Search */}
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input 
            placeholder="Search..." 
            className="pl-9 w-64 h-9 bg-gray-100/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus-visible:ring-emerald-500"
          />
        </div>

        <Separator orientation="vertical" className="h-8 hidden md:block" />
        
        {/* Help button */}
        <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
          <HelpCircle size={18} className="text-gray-500 dark:text-gray-400" />
        </Button>
        
        {/* Notifications */}
        <NotificationBell />
        
        {/* Theme toggle */}
        <ModeToggle />
        
        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="cursor-pointer ml-1">
              <UserAvatar user={user} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex flex-col space-y-1 p-2">
              <p className="font-medium">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{adminRole}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => navigate('/admin/settings')}
              className="cursor-pointer"
            >
              Admin Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400 focus:text-red-700 cursor-pointer">
              <LogOut size={14} className="mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
};

export default AdminHeader;