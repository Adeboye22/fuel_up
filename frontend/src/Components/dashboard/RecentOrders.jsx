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

const RecentOrders = ({ orders }) => {
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-500 dark:text-gray-400 font-medium text-sm">Order ID</TableHead>
                  <TableHead className="text-gray-500 dark:text-gray-400 font-medium text-sm">Date</TableHead>
                  <TableHead className="text-gray-500 dark:text-gray-400 font-medium text-sm">Type</TableHead>
                  <TableHead className="text-gray-500 dark:text-gray-400 font-medium text-sm">Amount</TableHead>
                  <TableHead className="text-gray-500 dark:text-gray-400 font-medium text-sm">Status</TableHead>
                  <TableHead className="text-right text-gray-500 dark:text-gray-400 font-medium text-sm">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <OrderRow key={order.id} order={order} />
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const OrderRow = ({ order }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400';
      case 'In Transit':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400';
      default:
        return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400';
    }
  };

  return (
    <TableRow className="border-t border-gray-200 dark:border-gray-700/30">
      <TableCell className="text-sm text-gray-800 dark:text-white">{order.id}</TableCell>
      <TableCell className="text-sm text-gray-600 dark:text-gray-300">
        <div className="flex items-center">
          <FaCalendarAlt className="mr-2 text-gray-400 dark:text-gray-500" size={12} />
          {order.date}
        </div>
      </TableCell>
      <TableCell className="text-sm text-gray-800 dark:text-white">{order.type}</TableCell>
      <TableCell className="text-sm text-gray-800 dark:text-white">{order.amount}</TableCell>
      <TableCell className="text-sm">
        <Badge variant="outline" className={`${getStatusStyle(order.status)}`}>
          {order.status}
        </Badge>
      </TableCell>
      <TableCell className="text-sm text-right text-gray-800 dark:text-white">₦{order.price.toLocaleString()}</TableCell>
    </TableRow>
  );
};

export default RecentOrders;