import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaBell, 
  FaTruck, 
  FaCheck, 
  FaInfoCircle, 
  FaExclamationTriangle,
  FaTrash,
  FaEllipsisH
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

const NotificationsPage = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Order Delivered',
      message: 'Your order #ORD-7842 (25L Petrol) has been delivered.',
      type: 'success',
      date: 'Mar 8, 2025',
      time: '10:15 AM',
      read: true
    },
    {
      id: 2,
      title: 'Order In Transit',
      message: 'Your order #ORD-7835 (40L Diesel) is on its way.',
      type: 'info',
      date: 'Mar 5, 2025',
      time: '11:30 AM',
      read: true
    },
    {
      id: 3,
      title: 'Special Offer',
      message: 'Get 5% off on your next diesel order above 30L. Valid until March 20.',
      type: 'promo',
      date: 'Mar 3, 2025',
      time: '09:00 AM',
      read: false
    },
    {
      id: 4,
      title: 'Price Update',
      message: 'Petrol prices have been updated to ₦790/L effective immediately.',
      type: 'important',
      date: 'Mar 1, 2025',
      time: '12:00 PM',
      read: false
    },
    {
      id: 5,
      title: 'Scheduled Maintenance',
      message: 'Our service will be undergoing maintenance on March 15 from 2AM to 4AM.',
      type: 'warning',
      date: 'Feb 28, 2025',
      time: '03:45 PM',
      read: true
    },
    {
      id: 6,
      title: 'Payment Successful',
      message: 'Your payment of ₦23,700 for order #ORD-7819 was successful.',
      type: 'success',
      date: 'Feb 28, 2025',
      time: '02:50 PM',
      read: true
    }
  ]);

  const filteredNotifications = notifications.filter(notification => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'unread') return !notification.read;
    return notification.type === selectedFilter;
  });

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheck className="text-emerald-500" />;
      case 'info':
      case 'promo':
        return <FaInfoCircle className="text-blue-500" />;
      case 'warning':
      case 'important':
        return <FaExclamationTriangle className="text-amber-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-50 dark:bg-emerald-500/10';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-500/10';
      case 'promo':
        return 'bg-indigo-50 dark:bg-indigo-500/10';
      case 'warning':
        return 'bg-amber-50 dark:bg-amber-500/10';
      case 'important':
        return 'bg-red-50 dark:bg-red-500/10';
      default:
        return 'bg-gray-50 dark:bg-gray-500/10';
    }
  };

  const unreadCount = notifications.filter(notif => !notif.read).length;

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
              <SelectItem value="success">Order Updates</SelectItem>
              <SelectItem value="important">Important</SelectItem>
              <SelectItem value="promo">Promotions</SelectItem>
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
              {notifications.length > 0 && (
                <DropdownMenuItem 
                  onClick={clearAllNotifications}
                  className="cursor-pointer text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                >
                  Clear all
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="w-full space-y-3 mt-2">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              getNotificationIcon={getNotificationIcon}
              getNotificationColor={getNotificationColor}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
            />
          ))
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
              {notification.title}
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