import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaEye, FaDownload } from 'react-icons/fa';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import useOrderStore from '@/stores/useOrderStore';

const OrderHistory = () => {
  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Get orders data from store
  const { 
    orders, 
    ordersPagination, 
    loading, 
    error, 
    fetchOrders,
    getOrderById
  } = useOrderStore();

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders('/orders/user');
  }, [fetchOrders]);

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order._id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle pagination
  const handlePageChange = (page) => {
    fetchOrders(`/orders/user?page=${page}&limit=${ordersPagination.pageSize}`);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric'
    }).format(date);
  };

  // Get status style
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
        return 'bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400';
    }
  };

  // Format status for display
  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // View order details
  // const viewOrderDetails = async (orderId) => {
  //   await getOrderById(orderId);
  //   setSelectedOrder(orders.find(order => order._id === orderId));
  // };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className='w-full max-w-[21rem] md:max-w-full'
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Orders</h1>
      </div>
      
      <Card className="border-gray-200 dark:border-gray-700/50 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-64">
              <Input
                placeholder="Search orders"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-white dark:bg-gray-800"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="text-gray-500"
              >
                <FaFilter size={16} />
              </Button>
            </div>
          </div>
          
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="mt-4"
            >
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-white dark:bg-gray-800">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          )}
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
                    <TableHead className="text-gray-500 dark:text-gray-400">Order ID</TableHead>
                    <TableHead className="text-gray-500 dark:text-gray-400">Date</TableHead>
                    <TableHead className="text-gray-500 dark:text-gray-400">Items</TableHead>
                    <TableHead className="text-gray-500 dark:text-gray-400">Status</TableHead>
                    <TableHead className="text-right text-gray-500 dark:text-gray-400">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <TableRow key={order._id} className="border-t border-gray-200 dark:border-gray-700/30">
                        <TableCell className="font-medium text-gray-800 dark:text-white">
                          {order._id.slice(-6).toUpperCase()}
                        </TableCell>
                        <TableCell className="text-gray-600 dark:text-gray-300">
                          {formatDate(order.createdAt)}
                        </TableCell>
                        <TableCell className="text-gray-800 dark:text-white">
                          {order.orderItems?.length > 0 ? (
                            `${order.orderItems[0].productName} ${
                              order.orderItems.length > 1 ? 
                              `+ ${order.orderItems.length - 1} more` : 
                              ''
                            }`
                          ) : 'No items'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusStyle(order.status)}>
                            {formatStatus(order.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-gray-800 dark:text-white">
                          ₦{order.totalAmount.toLocaleString()}
                        </TableCell>
                        {/* <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => viewOrderDetails(order._id)}
                                className="p-1"
                              >
                                <FaEye size={16} className="text-gray-500" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              {selectedOrder && (
                                <>
                                  <DialogHeader>
                                    <DialogTitle>Order Details · {selectedOrder._id.slice(-6).toUpperCase()}</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                      <div className="text-gray-500 dark:text-gray-400">Order Date</div>
                                      <div>{formatDate(selectedOrder.createdAt)}</div>
                                      
                                      <div className="text-gray-500 dark:text-gray-400">Status</div>
                                      <div>
                                        <Badge variant="outline" className={getStatusStyle(selectedOrder.status)}>
                                          {formatStatus(selectedOrder.status)}
                                        </Badge>
                                      </div>
                                      
                                      <div className="text-gray-500 dark:text-gray-400">Total Amount</div>
                                      <div>₦{selectedOrder.totalAmount.toLocaleString()}</div>
                                    </div>
                                    
                                    <div>
                                      <h3 className="font-medium mb-2">Order Items</h3>
                                      <div className="space-y-2">
                                        {selectedOrder.orderItems?.map((item, index) => (
                                          <div key={item._id} className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
                                            <div className="flex justify-between mb-1">
                                              <span className="font-medium">{item.productName}</span>
                                              <span>₦{item.price.toLocaleString()}</span>
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                              {item.qunatity} × ₦{item.unitPrice.toLocaleString()}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    
                                    {selectedOrder.status === 'delivered' && (
                                      <div className="rounded-lg bg-green-50 dark:bg-green-500/10 p-3 text-green-600 dark:text-green-400 text-sm">
                                        This order was delivered successfully.
                                      </div>
                                    )}
                                    
                                    {selectedOrder.status === 'processing' && (
                                      <div className="rounded-lg bg-blue-50 dark:bg-blue-500/10 p-3 text-blue-600 dark:text-blue-400 text-sm">
                                        Your order is being processed and will be delivered soon.
                                      </div>
                                    )}
                                    
                                    {selectedOrder.status === 'cancelled' && (
                                      <div className="rounded-lg bg-red-50 dark:bg-red-500/10 p-3 text-red-600 dark:text-red-400 text-sm">
                                        This order was cancelled.
                                      </div>
                                    )}
                                  </div>
                                </>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell> */}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-gray-500">No orders found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          
          {!loading && ordersPagination.totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (ordersPagination.hasPreviousPage) {
                        handlePageChange(ordersPagination.currentPage - 1);
                      }
                    }}
                    className={!ordersPagination.hasPreviousPage ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: ordersPagination.totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(i + 1);
                      }}
                      isActive={ordersPagination.currentPage === i + 1}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (ordersPagination.hasNextPage) {
                        handlePageChange(ordersPagination.currentPage + 1);
                      }
                    }}
                    className={!ordersPagination.hasNextPage ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OrderHistory;