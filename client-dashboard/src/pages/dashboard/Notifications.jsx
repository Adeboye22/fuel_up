import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, Trash2, Filter, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'react-hot-toast';
import apiService from '@/lib/api';
import CreateNotification from '@/components/dashboard/CreateNotification';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 10,
    hasNextPage: false,
    hasPreviousPage: false
  });

  useEffect(() => {
    fetchNotifications(1);
  }, []);

  const fetchNotifications = async (page = 1) => {
    try {
      setLoading(true);
      const response = await apiService.get(`/notifications?page=${page}&limit=10`);
      if (response.status === 'success') {
        setNotifications(response.data.data);
        setPagination({
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
          totalCount: response.data.totalCount,
          pageSize: response.data.pageSize,
          hasNextPage: response.data.hasNextPage,
          hasPreviousPage: response.data.hasPreviousPage
        });
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await apiService.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(notification => 
        notification._id === id ? { ...notification, isRead: true } : notification
      ));
      toast.success('Notification marked as read');
    } catch (err) {
      console.error('Error marking notification as read:', err);
      toast.error('Failed to update notification');
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiService.put('/notifications/read-all');
      setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      toast.error('Failed to update notifications');
    }
  };

  const deleteNotification = async (id) => {
    try {
      await apiService.delete(`/notifications/${id}`);
      setNotifications(notifications.filter(notification => notification._id !== id));
      toast.success('Notification deleted');
    } catch (err) {
      console.error('Error deleting notification:', err);
      toast.error('Failed to delete notification');
    }
  };

  const clearAllNotifications = async () => {
    try {
      await apiService.delete('/notifications');
      setNotifications([]);
      toast.success('All notifications cleared');
    } catch (err) {
      console.error('Error clearing notifications:', err);
      toast.error('Failed to clear notifications');
    }
  };

  const refreshNotifications = () => {
    fetchNotifications(pagination.currentPage);
    toast.success('Notifications refreshed');
  };

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      fetchNotifications(pagination.currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pagination.hasPreviousPage) {
      fetchNotifications(pagination.currentPage - 1);
    }
  };

  const filteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(notification => !notification.isRead);
      case 'read':
        return notifications.filter(notification => notification.isRead);
      default:
        return notifications;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Manage and view your system notifications
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <CreateNotification onNotificationCreated={refreshNotifications} />
          
          <Button
            variant="outline"
            size="sm"
            onClick={refreshNotifications}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilter('all')}>
                All Notifications
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('unread')}>
                Unread Only
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('read')}>
                Read Only
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={markAllAsRead}>
                Mark All as Read
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={clearAllNotifications}
                className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
              >
                Clear All Notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <NotificationsList 
            notifications={filteredNotifications()} 
            loading={loading} 
            error={error}
            markAsRead={markAsRead}
            deleteNotification={deleteNotification}
          />
          <PaginationControls 
            pagination={pagination}
            onNextPage={handleNextPage}
            onPreviousPage={handlePreviousPage}
          />
        </TabsContent>
        
        <TabsContent value="unread" className="mt-6">
          <NotificationsList 
            notifications={notifications.filter(n => !n.isRead)} 
            loading={loading} 
            error={error}
            markAsRead={markAsRead}
            deleteNotification={deleteNotification}
            emptyMessage="No unread notifications"
          />
        </TabsContent>
        
        <TabsContent value="today" className="mt-6">
          <NotificationsList 
            notifications={notifications.filter(n => {
              const today = new Date();
              const notificationDate = new Date(n.createdAt);
              return notificationDate.toDateString() === today.toDateString();
            })} 
            loading={loading} 
            error={error}
            markAsRead={markAsRead}
            deleteNotification={deleteNotification}
            emptyMessage="No notifications today"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const PaginationControls = ({ pagination, onNextPage, onPreviousPage }) => {
  if (pagination.totalPages <= 1) return null;
  
  return (
    <div className="flex items-center justify-between mt-6">
      <p className="text-sm text-gray-500">
        Page {pagination.currentPage} of {pagination.totalPages} 
        ({pagination.totalCount} notifications)
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPreviousPage}
          disabled={!pagination.hasPreviousPage}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={!pagination.hasNextPage}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const NotificationsList = ({ 
  notifications, 
  loading, 
  error, 
  markAsRead, 
  deleteNotification,
  emptyMessage = "No notifications found" 
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 dark:border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!notifications?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Bell className="h-12 w-12 text-gray-400 mb-4" />
        <p className="text-xl font-medium text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <NotificationItem 
          key={notification._id} 
          notification={notification} 
          markAsRead={markAsRead}
          deleteNotification={deleteNotification}
        />
      ))}
    </div>
  );
};

const NotificationItem = ({ notification, markAsRead, deleteNotification }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`border-l-4 ${notification.isRead ? 'border-l-gray-300 dark:border-l-gray-700' : 'border-l-blue-500'}`}>
        <CardContent className="p-0">
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-800">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="space-y-1">
                <p className={`text-sm font-medium ${notification.isRead ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                  {notification.type}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {notification.message}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!notification.isRead && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-blue-600 dark:text-blue-400"
                  onClick={() => markAsRead(notification._id)}
                >
                  <Check className="h-4 w-4" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-600 dark:text-red-400"
                onClick={() => deleteNotification(notification._id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Helper function to generate notification icon
const getNotificationIcon = (type) => {
  const lowerType = type ? type.toLowerCase() : '';
  
  if (lowerType.includes('order')) {
    return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Order</Badge>;
  } else if (lowerType.includes('user')) {
    return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">User</Badge>;
  } else if (lowerType.includes('payment')) {
    return <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">Payment</Badge>;
  } else if (lowerType.includes('alert')) {
    return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Alert</Badge>;
  } else if (lowerType.includes('system')) {
    return <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">System</Badge>;
  } else {
    return <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">Info</Badge>;
  }
};

export default Notifications;