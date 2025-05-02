import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, Trash2, Filter, RefreshCw } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'react-hot-toast';
import apiService from '@/lib/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await apiService.get('/admin/notifications');
      if (response.status === 'success') {
        setNotifications(response.data);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
      // Use sample data if API fails
      setNotifications(sampleNotifications);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await apiService.put(`/admin/notifications/${id}/read`);
      setNotifications(notifications.map(notification => 
        notification._id === id ? { ...notification, read: true } : notification
      ));
      toast.success('Notification marked as read');
    } catch (err) {
      console.error('Error marking notification as read:', err);
      toast.error('Failed to update notification');
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiService.put('/admin/notifications/read-all');
      setNotifications(notifications.map(notification => ({ ...notification, read: true })));
      toast.success('All notifications marked as read');
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      toast.error('Failed to update notifications');
    }
  };

  const deleteNotification = async (id) => {
    try {
      await apiService.delete(`/admin/notifications/${id}`);
      setNotifications(notifications.filter(notification => notification._id !== id));
      toast.success('Notification deleted');
    } catch (err) {
      console.error('Error deleting notification:', err);
      toast.error('Failed to delete notification');
    }
  };

  const clearAllNotifications = async () => {
    try {
      await apiService.delete('/admin/notifications');
      setNotifications([]);
      toast.success('All notifications cleared');
    } catch (err) {
      console.error('Error clearing notifications:', err);
      toast.error('Failed to clear notifications');
    }
  };

  const refreshNotifications = () => {
    fetchNotifications();
    toast.success('Notifications refreshed');
  };

  const filteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(notification => !notification.read);
      case 'read':
        return notifications.filter(notification => notification.read);
      case 'orders':
        return notifications.filter(notification => notification.type === 'order');
      case 'users':
        return notifications.filter(notification => notification.type === 'user');
      case 'system':
        return notifications.filter(notification => notification.type === 'system');
      default:
        return notifications;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Order</Badge>;
      case 'user':
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">User</Badge>;
      case 'payment':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">Payment</Badge>;
      case 'alert':
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Alert</Badge>;
      case 'system':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">System</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">Info</Badge>;
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
        <div className="flex items-center gap-2">
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
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilter('orders')}>
                Order Notifications
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('users')}>
                User Notifications
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('system')}>
                System Notifications
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
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <NotificationsList 
            notifications={filteredNotifications()} 
            loading={loading} 
            error={error}
            markAsRead={markAsRead}
            deleteNotification={deleteNotification}
          />
        </TabsContent>
        
        <TabsContent value="unread" className="mt-6">
          <NotificationsList 
            notifications={notifications.filter(n => !n.read)} 
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
        
        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <NotificationSetting 
                title="Order Notifications" 
                description="Receive notifications for new orders and status changes" 
              />
              <Separator />
              <NotificationSetting 
                title="User Notifications" 
                description="Receive notifications for new user registrations and activities" 
              />
              <Separator />
              <NotificationSetting 
                title="Payment Notifications" 
                description="Receive notifications for payment confirmations and issues" 
              />
              <Separator />
              <NotificationSetting 
                title="System Alerts" 
                description="Receive critical system notifications and alerts" 
                defaultChecked={true}
              />
              <Separator />
              <NotificationSetting 
                title="Email Notifications" 
                description="Receive notifications via email in addition to the dashboard" 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
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
      <Card className={`border-l-4 ${notification.read ? 'border-l-gray-300 dark:border-l-gray-700' : 'border-l-blue-500'}`}>
        <CardContent className="p-0">
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-800">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="space-y-1">
                <p className={`text-sm font-medium ${notification.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                  {notification.title}
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
              {!notification.read && (
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

const NotificationSetting = ({ title, description, defaultChecked = false }) => {
  const [enabled, setEnabled] = useState(defaultChecked);

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <h3 className="text-base font-medium">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <Switch 
        checked={enabled} 
        onCheckedChange={setEnabled} 
        aria-label={`${title} toggle`}
      />
    </div>
  );
};

// Helper function to generate notification icon
const getNotificationIcon = (type) => {
  switch (type) {
    case 'order':
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Order</Badge>;
    case 'user':
      return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">User</Badge>;
    case 'payment':
      return <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">Payment</Badge>;
    case 'alert':
      return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Alert</Badge>;
    case 'system':
      return <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">System</Badge>;
    default:
      return <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">Info</Badge>;
  }
};

// Sample notifications data for fallback
const sampleNotifications = [
  {
    _id: '1',
    title: 'New Order Placed',
    message: 'Order #12345 has been placed for 500L of diesel',
    type: 'order',
    read: false,
    createdAt: new Date(new Date().setHours(new Date().getHours() - 1)),
  },
  {
    _id: '2',
    title: 'Payment Received',
    message: 'Payment of ₦250,000 has been confirmed for Order #12345',
    type: 'payment',
    read: false,
    createdAt: new Date(new Date().setHours(new Date().getHours() - 3)),
  },
  {
    _id: '3',
    title: 'New User Registration',
    message: 'A new user has registered: John Doe (john.doe@example.com)',
    type: 'user',
    read: true,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
  },
  {
    _id: '4',
    title: 'Low Inventory Alert',
    message: 'Petrol inventory is below threshold at Lagos Main Terminal',
    type: 'alert',
    read: false,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
  },
  {
    _id: '5',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur on Sunday at 2:00 AM',
    type: 'system',
    read: true,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 3)),
  },
  {
    _id: '6',
    title: 'Order Status Updated',
    message: 'Order #12340 has been marked as delivered',
    type: 'order',
    read: true,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 3)),
  },
  {
    _id: '7',
    title: 'Price Update',
    message: 'Fuel prices have been updated. Petrol: ₦700/L, Diesel: ₦750/L',
    type: 'system',
    read: false,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 4)),
  }
];

export default Notifications;