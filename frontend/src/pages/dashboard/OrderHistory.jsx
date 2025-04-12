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

const OrderHistory = () => {
  // Mock data
  const [orders, setOrders] = useState([
    { id: 'ORD-7842', date: '2025-03-08', type: 'Petrol', amount: '25L', status: 'Delivered', price: 19750, location: 'Home', deliveryDate: '2025-03-08', paymentMethod: 'Card' },
    { id: 'ORD-7835', date: '2025-03-05', type: 'Diesel', amount: '40L', status: 'In Transit', price: 37000, location: 'Office', deliveryDate: '2025-03-06', paymentMethod: 'Card' },
    { id: 'ORD-7819', date: '2025-02-28', type: 'Petrol', amount: '30L', status: 'Delivered', price: 23700, location: 'Home', deliveryDate: '2025-02-28', paymentMethod: 'Wallet' },
    { id: 'ORD-7810', date: '2025-02-22', type: 'Kerosene', amount: '15L', status: 'Delivered', price: 12750, location: 'Site', deliveryDate: '2025-02-23', paymentMethod: 'Card' },
    { id: 'ORD-7796', date: '2025-02-15', type: 'Diesel', amount: '35L', status: 'Delivered', price: 32375, location: 'Office', deliveryDate: '2025-02-15', paymentMethod: 'Wallet' },
  ]);

  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const ordersPerPage = 5;

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);
  
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400';
      case 'In Transit':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400';
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
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
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-500"
              >
                <FaDownload size={16} />
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
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="In Transit">In Transit</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          )}
        </CardHeader>
        
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-500 dark:text-gray-400">ID</TableHead>
                  <TableHead className="text-gray-500 dark:text-gray-400">Date</TableHead>
                  <TableHead className="text-gray-500 dark:text-gray-400">Type</TableHead>
                  <TableHead className="text-gray-500 dark:text-gray-400">Status</TableHead>
                  <TableHead className="text-right text-gray-500 dark:text-gray-400">Price</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentOrders.length > 0 ? (
                  currentOrders.map((order) => (
                    <TableRow key={order.id} className="border-t border-gray-200 dark:border-gray-700/30">
                      <TableCell className="font-medium text-gray-800 dark:text-white">{order.id}</TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-300">{formatDate(order.date)}</TableCell>
                      <TableCell className="text-gray-800 dark:text-white">{order.type} · {order.amount}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusStyle(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-gray-800 dark:text-white">₦{order.price.toLocaleString()}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setSelectedOrder(order)}
                              className="p-1"
                            >
                              <FaEye size={16} className="text-gray-500" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Order Details · {order.id}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                <div className="text-gray-500 dark:text-gray-400">Order Date</div>
                                <div>{formatDate(order.date)}</div>
                                
                                <div className="text-gray-500 dark:text-gray-400">Status</div>
                                <div>
                                  <Badge variant="outline" className={getStatusStyle(order.status)}>
                                    {order.status}
                                  </Badge>
                                </div>
                                
                                <div className="text-gray-500 dark:text-gray-400">Fuel Type</div>
                                <div>{order.type}</div>
                                
                                <div className="text-gray-500 dark:text-gray-400">Amount</div>
                                <div>{order.amount}</div>
                                
                                <div className="text-gray-500 dark:text-gray-400">Price</div>
                                <div>₦{order.price.toLocaleString()}</div>
                                
                                <div className="text-gray-500 dark:text-gray-400">Delivery Location</div>
                                <div>{order.location}</div>
                                
                                <div className="text-gray-500 dark:text-gray-400">Payment Method</div>
                                <div>{order.paymentMethod}</div>
                              </div>
                              
                              {order.status === 'Delivered' && (
                                <div className="rounded-lg bg-green-50 dark:bg-green-500/10 p-3 text-green-600 dark:text-green-400 text-sm">
                                  This order was delivered on {formatDate(order.deliveryDate)}.
                                </div>
                              )}
                              
                              {order.status === 'In Transit' && (
                                <div className="rounded-lg bg-blue-50 dark:bg-blue-500/10 p-3 text-blue-600 dark:text-blue-400 text-sm">
                                  Your order is on the way and will be delivered soon.
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
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
          
          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(i + 1);
                      }}
                      isActive={currentPage === i + 1}
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
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
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