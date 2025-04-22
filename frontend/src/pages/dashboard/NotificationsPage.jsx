import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaBell, 
  FaCheck, 
  FaInfoCircle, 
  FaExclamationTriangle,
  FaTrash,
  FaEllipsisH,
  FaShoppingCart,
  FaFileInvoice
} from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import apiService from '@/lib/api';

const NotificationsPage = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 10,
    hasNextPage: false,
    hasPreviousPage: false
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async (page = 1) => {
    setLoading(true);
    try {
      const response = await apiService.get(`/notifications?page=${page}&limit=10`);
      
      if (response.status === "success") {
        setNotifications(response.data.data);
        setPagination({
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          totalCount: response.data.totalCount,
          pageSize: response.data.pageSize,
          hasNextPage: response.data.hasNextPage,
          hasPreviousPage: response.data.hasPreviousPage
        });
      } else {
        setError("Failed to load notifications");
      }
    } catch (err) {
      setError("An error occurred while fetching notifications");
      console.error("Notification fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'unread') return !notification.isRead;
    return notification.type.toLowerCase().includes(selectedFilter.toLowerCase());
  });

  const markAllAsRead = async () => {
    try {
      await apiService.patch('/notifications/mark-all-read');
      setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  const markAsRead = async (id) => {
    try {
      // Updated to use PATCH method as specified
      const response = await apiService.patch(`/notifications/${id}`);
      
      if (response.data.status === "success") {
        setNotifications(notifications.map(notif => 
          notif._id === id ? { ...notif, isRead: true } : notif
        ));
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await apiService.delete(`/notifications/${id}`);
      setNotifications(notifications.filter(notif => notif._id !== id));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const getNotificationIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'order processed':
      case 'order completed':
        return <FaCheck className="text-emerald-500" />;
      case 'order created':
        return <FaShoppingCart className="text-blue-500" />;
      case 'payment':
        return <FaFileInvoice className="text-purple-500" />;
      case 'warning':
      case 'alert':
        return <FaExclamationTriangle className="text-amber-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type.toLowerCase()) {
      case 'order processed':
      case 'order completed':
        return 'bg-emerald-50 dark:bg-emerald-500/10';
      case 'order created':
        return 'bg-blue-50 dark:bg-blue-500/10';
      case 'payment':
        return 'bg-purple-50 dark:bg-purple-500/10';
      case 'warning':
      case 'alert':
        return 'bg-amber-50 dark:bg-amber-500/10';
      default:
        return 'bg-gray-50 dark:bg-gray-500/10';
    }
  };

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  const loadNextPage = () => {
    if (pagination.hasNextPage) {
      fetchNotifications(pagination.currentPage + 1);
    }
  };

  const loadPrevPage = () => {
    if (pagination.hasPreviousPage) {
      fetchNotifications(pagination.currentPage - 1);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-6 max-w-4xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row w-full items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Notifications</h1>
          {unreadCount > 0 && (
            <Badge className="ml-2 bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              {unreadCount} New
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-36 sm:w-40">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Notifications</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="order">Orders</SelectItem>
              <SelectItem value="payment">Payments</SelectItem>
            </SelectContent>
          </Select>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {unreadCount > 0 && (
                <DropdownMenuItem onClick={markAllAsRead} className="cursor-pointer">
                  Mark all as read
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="w-full space-y-3 mt-2">
        {loading ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            Loading notifications...
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500 dark:text-red-400">
            {error}
          </div>
        ) : filteredNotifications.length > 0 ? (
          <>
            {filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={{
                  id: notification._id,
                  message: notification.message,
                  type: notification.type,
                  read: notification.isRead,
                  date: formatDate(notification.createdAt),
                  time: formatTime(notification.createdAt)
                }}
                getNotificationIcon={getNotificationIcon}
                getNotificationColor={getNotificationColor}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
              />
            ))}
            
            {(pagination.hasNextPage || pagination.hasPreviousPage) && (
              <div className="flex justify-center gap-4 mt-6">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={loadPrevPage}
                  disabled={!pagination.hasPreviousPage}
                >
                  Previous
                </Button>
                <span className="flex items-center text-sm text-gray-500">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={loadNextPage}
                  disabled={!pagination.hasNextPage}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No notifications to display
          </div>
        )}
      </div>
    </motion.div>
  );
};

const NotificationItem = ({ notification, getNotificationIcon, getNotificationColor, onMarkAsRead, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border ${notification.read ? 'border-gray-100 dark:border-gray-700/50' : 'border-emerald-200 dark:border-emerald-700/50'} rounded-lg p-4 ${notification.read ? 'bg-white dark:bg-gray-800/40' : 'bg-emerald-50/50 dark:bg-emerald-900/10'} transition-colors`}
    >
      <div className="flex items-start">
        <div className={`p-2 rounded-lg mr-3 ${getNotificationColor(notification.type)}`}>
          {getNotificationIcon(notification.type)}
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <h3 className={`font-medium ${notification.read ? 'text-gray-800 dark:text-white' : 'text-emerald-700 dark:text-emerald-400'}`}>
              {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
            </h3>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <FaEllipsisH className="h-3 w-3 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {!notification.read && (
                  <DropdownMenuItem onClick={() => onMarkAsRead(notification.id)} className="cursor-pointer">
                    <FaCheck className="mr-2 h-4 w-4" /> Mark as read
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onDelete(notification.id)} className="cursor-pointer text-red-600 dark:text-red-400">
                  <FaTrash className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {notification.message}
          </p>
          
          <div className="flex items-center mt-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {notification.date} • {notification.time}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationsPage;