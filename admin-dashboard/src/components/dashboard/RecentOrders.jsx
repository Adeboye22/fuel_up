import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCalendarAlt } from 'react-icons/fa';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const RecentOrders = ({ orders, loading, error }) => {
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="lg:col-span-2"
    >
      <Card className="border-gray-200 dark:border-gray-700/50 shadow-sm backdrop-blur-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-bold text-gray-800 dark:text-white">
            Recent Orders
          </CardTitle>
          <Link 
            to="/history" 
            className="text-emerald-600 dark:text-emerald-400 text-sm hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors"
          >
            View All
          </Link>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 dark:border-white"></div>
            </div>
          ) : error ? (
            <div className="text-center py-6 text-red-500">
              {error}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-500 dark:text-gray-400 font-medium text-sm">Order ID</TableHead>
                    <TableHead className="text-gray-500 dark:text-gray-400 font-medium text-sm">Date</TableHead>
                    <TableHead className="text-gray-500 dark:text-gray-400 font-medium text-sm">Items</TableHead>
                    <TableHead className="text-gray-500 dark:text-gray-400 font-medium text-sm">Status</TableHead>
                    <TableHead className="text-right text-gray-500 dark:text-gray-400 font-medium text-sm">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders && orders.length > 0 ? (
                    orders.map((order) => (
                      <OrderRow key={order._id} order={order} formatDate={formatDate} />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-gray-500">No recent orders</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const OrderRow = ({ order, formatDate }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'delivered':
      case 'paid':
        return 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400';
      case 'pending':
      case 'processing':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400';
      case 'cancelled':
        return 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400';
      default:
        return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400';
    }
  };

  // Format status for display
  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Get item summary
  const getItemSummary = () => {
    if (!order.orderItems || order.orderItems.length === 0) {
      return 'No items';
    }
    
    return `${order.orderItems[0].productName} ${
      order.orderItems.length > 1 ? 
      `+ ${order.orderItems.length - 1} more` : 
      ''
    }`;
  };

  return (
    <TableRow className="border-t border-gray-200 dark:border-gray-700/30">
      <TableCell className="text-sm text-gray-800 dark:text-white">
        {order._id.slice(-6).toUpperCase()}
      </TableCell>
      <TableCell className="text-sm text-gray-600 dark:text-gray-300">
        <div className="flex items-center">
          <FaCalendarAlt className="mr-2 text-gray-400 dark:text-gray-500" size={12} />
          {formatDate(order.createdAt)}
        </div>
      </TableCell>
      <TableCell className="text-sm text-gray-800 dark:text-white">
        {getItemSummary()}
      </TableCell>
      <TableCell className="text-sm">
        <Badge variant="outline" className={getStatusStyle(order.status)}>
          {formatStatus(order.status)}
        </Badge>
      </TableCell>
      <TableCell className="text-sm text-right text-gray-800 dark:text-white">
        ₦{order.totalAmount.toLocaleString()}
      </TableCell>
    </TableRow>
  );
};

export default RecentOrders;