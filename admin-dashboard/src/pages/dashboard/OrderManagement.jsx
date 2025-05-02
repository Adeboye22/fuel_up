import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaFileExport, FaPlus, FaShippingFast } from 'react-icons/fa';
import apiService from '@/lib/api';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [createOrderOpen, setCreateOrderOpen] = useState(false);
  const [assignDeliveryOpen, setAssignDeliveryOpen] = useState(false);
  const [orderToAssign, setOrderToAssign] = useState(null);
  const [newOrderData, setNewOrderData] = useState({
    productName: '',
    unitPrice: 0,
    quantity: 1,
    orderAddress: ''
  });

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      const response = await apiService.get(`/orders?page=${page}&limit=${perPage}`);
      
      if (response.status === 'success') {
        setOrders(response.data.data);
        setFilteredOrders(response.data.data);
        setTotalPages(response.data.totalPages);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (err) {
      setError('Error connecting to the server');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters when search term or status filter changes
  useEffect(() => {
    const filtered = orders.filter(order => {
      const matchesSearch = 
        searchTerm === '' || 
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.userId && order.userId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.orderAddress && order.orderAddress.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = 
        statusFilter === 'all' || 
        order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    
    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Get status badge styling
  const getStatusStyle = (status) => {
    switch (status) {
      case 'delivered':
      case 'paid':
        return 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400';
      case 'initiated':
      case 'processing':
      case 'shipping':
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

  // View order details
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
  };

  // Calculate total items in an order
  const calculateTotalItems = (orderItems) => {
    if (!orderItems || !orderItems.length) return 0;
    return orderItems.reduce((total, item) => total + (item.qunatity || 0), 0);
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      let endpoint = `/orders/${orderId}`;
      
      if (newStatus === 'delivered') {
        endpoint = `/orders/${orderId}/delivery`;
      }
      
      const response = await apiService.patch(endpoint, { status: newStatus });
      
      if (response.status === 'success') {
        // Update local state
        const updatedOrders = orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
        
        // If currently viewing details of this order, update that too
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }

        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to update order status:", error);
      return false;
    }
  };

  // Assign delivery agent
  const assignDeliveryAgent = async (orderId, deliveryAgentId) => {
    try {
      const response = await apiService.patch(`/orders/${orderId}/assign`, { 
        toBeDeliveredBy: deliveryAgentId 
      });
      
      if (response.status === 'success') {
        // Update local state
        const updatedOrders = orders.map(order => 
          order._id === orderId ? { ...order, toBeDeliveredBy: deliveryAgentId, status: 'shipping' } : order
        );
        setOrders(updatedOrders);
        
        // If currently viewing details of this order, update that too
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, toBeDeliveredBy: deliveryAgentId, status: 'shipping' });
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to assign delivery agent:", error);
      return false;
    }
  };

  // Handle creating a new order
  const handleCreateOrder = async () => {
    try {
      const orderData = {
        orderItems: [
          {
            productName: newOrderData.productName,
            unitPrice: parseFloat(newOrderData.unitPrice),
            qunatity: parseInt(newOrderData.quantity)
          }
        ],
        orderAddress: newOrderData.orderAddress
      };

      const response = await apiService.post('/orders', orderData);
      
      if (response.status === 'success') {
        setCreateOrderOpen(false);
        // Reset form
        setNewOrderData({
          productName: '',
          unitPrice: 0,
          quantity: 1,
          orderAddress: ''
        });
        // Refresh orders
        fetchOrders(currentPage);
      }
    } catch (error) {
      console.error("Failed to create order:", error);
    }
  };

  // Calculate pagination
  const renderPagination = () => {
    // For small number of pages
    if (totalPages <= 5) {
      return [...Array(totalPages)].map((_, i) => (
        <PaginationItem key={i + 1}>
          <PaginationLink 
            onClick={() => setCurrentPage(i + 1)}
            isActive={currentPage === i + 1}
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      ));
    }
    
    // For larger number of pages
    let pages = [];
    
    // Always show first page
    pages.push(
      <PaginationItem key={1}>
        <PaginationLink 
          onClick={() => setCurrentPage(1)}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Add ellipsis if current page is > 3
    if (currentPage > 3) {
      pages.push(
        <PaginationItem key="ellipsis1">
          <span className="px-3">...</span>
        </PaginationItem>
      );
    }
    
    // Add pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => setCurrentPage(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Add ellipsis if current page is < totalPages - 2
    if (currentPage < totalPages - 2) {
      pages.push(
        <PaginationItem key="ellipsis2">
          <span className="px-3">...</span>
        </PaginationItem>
      );
    }
    
    // Always show last page
    if (totalPages > 1) {
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink 
            onClick={() => setCurrentPage(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return pages;
  };

  // Assign Delivery Agent Dialog Component
  const AssignDeliveryAgentDialog = ({ open, onOpenChange, orderId, onAssign }) => {
    const [deliveryAgentId, setDeliveryAgentId] = useState('');
    const [deliveryAgents, setDeliveryAgents] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Fetch delivery agents when dialog opens
    useEffect(() => {
      if (open) {
        fetchDeliveryAgents();
      }
    }, [open]);
    
    const fetchDeliveryAgents = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint for fetching delivery agents
        const response = await apiService.get('/delivery-agents');
        
        if (response.status === 'success') {
          setDeliveryAgents(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch delivery agents:", error);
        // Set some sample delivery agents for demonstration
        setDeliveryAgents([
          { _id: '67fa0a6b65f7895eeeb82e20', name: 'John Delivery' },
          { _id: '67fa0a7c65f7895eeeb82e21', name: 'Jane Shipping' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    const handleAssign = async () => {
      if (!deliveryAgentId) return;
      
      const success = await onAssign(orderId, deliveryAgentId);
      if (success) {
        onOpenChange(false);
        setDeliveryAgentId('');
      }
    };
    
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Order for Shipping</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-800 dark:border-white"></div>
              </div>
            ) : (
              <>
                {deliveryAgents.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Select Delivery Agent</label>
                    <Select value={deliveryAgentId} onValueChange={setDeliveryAgentId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a delivery agent" />
                      </SelectTrigger>
                      <SelectContent>
                        {deliveryAgents.map(agent => (
                          <SelectItem key={agent._id} value={agent._id}>
                            {agent.name || agent._id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium mb-1">Delivery Agent ID</label>
                  <Input 
                    value={deliveryAgentId}
                    onChange={(e) => setDeliveryAgentId(e.target.value)}
                    placeholder="Enter delivery agent ID"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the ID of the delivery agent who will handle this order.
                  </p>
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700" 
              onClick={handleAssign}
              disabled={!deliveryAgentId}
            >
              Assign for Shipping
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <Button 
          className="bg-emerald-600 hover:bg-emerald-700"
          onClick={() => setCreateOrderOpen(true)}
        >
          <FaPlus className="mr-2" /> Create Order
        </Button>
      </div>

      {/* Filters & search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <FaSearch className="absolute left-3 top-3 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Search by ID, customer or address..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="initiated">Initiated</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipping">Shipping</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="flex items-center gap-2">
            <FaFileExport size={14} />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-md border border-gray-200 dark:border-gray-700">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 dark:border-white"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            {error}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No orders found matching your criteria
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Order ID</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                  <TableCell className="font-medium">{order._id.slice(-6).toUpperCase()}</TableCell>
                  <TableCell>
                    <div className="font-medium">{order.userId?.slice(-6).toUpperCase() || 'N/A'}</div>
                    <div className="text-xs text-gray-500 truncate max-w-[200px]">{order.orderAddress || 'No address'}</div>
                  </TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>
                    {order.orderItems && order.orderItems.length > 0 ? (
                      <span>{calculateTotalItems(order.orderItems)} item(s)</span>
                    ) : (
                      <span className="text-gray-500">No items</span>
                    )}
                  </TableCell>
                  <TableCell>₦{order.totalAmount?.toLocaleString() || 0}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusStyle(order.status)}>
                      {formatStatus(order.status)}
                    </Badge>
                    {order.toBeDeliveredBy && (
                      <div className="text-xs text-gray-500 mt-1">
                        Agent: {order.toBeDeliveredBy.slice(-6).toUpperCase()}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <FaFilter className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => viewOrderDetails(order)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateOrderStatus(order._id, 'processing')}>
                          Mark as Processing
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setOrderToAssign(order._id);
                          setAssignDeliveryOpen(true);
                        }}>
                          <FaShippingFast className="mr-2 h-4 w-4" />
                          Assign for Shipping
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateOrderStatus(order._id, 'delivered')}>
                          Mark as Delivered
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateOrderStatus(order._id, 'paid')}>
                          Mark as Paid
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateOrderStatus(order._id, 'cancelled')} className="text-red-600">
                          Cancel Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && filteredOrders.length > 0 && (
        <Pagination className="justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {renderPagination()}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Order Details Dialog */}
      <Dialog open={orderDetailsOpen} onOpenChange={setOrderDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details - #{selectedOrder?._id?.slice(-6).toUpperCase()}</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              {/* Status and actions */}
              <div className="flex justify-between items-center">
                <Badge variant="outline" className={getStatusStyle(selectedOrder.status)}>
                  {formatStatus(selectedOrder.status)}
                </Badge>
                
                <Select 
                  value={selectedOrder.status} 
                  onValueChange={(value) => updateOrderStatus(selectedOrder._id, value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Change status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="initiated">Initiated</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipping">Shipping</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Customer information */}
              <div>
                <h3 className="text-lg font-medium mb-2">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">User ID</p>
                    <p className="font-medium">{selectedOrder.userId || 'N/A'}</p>
                  </div>
                  {selectedOrder.toBeDeliveredBy && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Delivery Agent</p>
                      <p className="font-medium">{selectedOrder.toBeDeliveredBy}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Ordered on</p>
                    <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
                    <p className="font-medium">{formatDate(selectedOrder.updatedAt)}</p>
                  </div>
                </div>
              </div>
              
              {/* Delivery Address */}
              {selectedOrder.orderAddress && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Delivery Address</h3>
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md">
                    <p>{selectedOrder.orderAddress}</p>
                  </div>
                </div>
              )}
              
              {/* Order Items */}
              <div>
                <h3 className="text-lg font-medium mb-2">Order Items</h3>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md">
                  {selectedOrder.orderItems && selectedOrder.orderItems.length > 0 ? (
                    <div className="space-y-4">
                      {selectedOrder.orderItems.map((item, index) => (
                        <div key={index} className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2 last:border-0 last:pb-0">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-md mr-4 flex-shrink-0"></div>
                            <div>
                              <p className="font-medium">{item.productName || 'Unknown Product'}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {item.qunatity} x ₦{item.unitPrice?.toLocaleString() || '0'}
                              </p>
                            </div>
                          </div>
                          <p className="font-medium">₦{item.price?.toLocaleString() || '0'}</p>
                        </div>
                      ))}
                      
                      {/* Order Summary */}
                      <div className="pt-4 space-y-2">
                        <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                          <p className="font-bold">Total</p>
                          <p className="font-bold">₦{selectedOrder.totalAmount?.toLocaleString() || '0'}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No items in this order</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setOrderDetailsOpen(false)}>
              Close
            </Button>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => window.print()}
            >
              <FaFileExport className="mr-2" /> Print Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Order Dialog */}
      <Dialog open={createOrderOpen} onOpenChange={setCreateOrderOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Product Name</label>
              <Input 
                value={newOrderData.productName}
                onChange={(e) => setNewOrderData({...newOrderData, productName: e.target.value})}
                placeholder="Enter product name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Unit Price (₦)</label>
              <Input 
                type="number"
                value={newOrderData.unitPrice}
                onChange={(e) => setNewOrderData({...newOrderData, unitPrice: e.target.value})}
                placeholder="Enter unit price"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <Input 
                type="number"
                value={newOrderData.quantity}
                onChange={(e) => setNewOrderData({...newOrderData, quantity: Math.max(1, parseInt(e.target.value))})}
                min="1"
                placeholder="Enter quantity"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Delivery Address</label>
              <Input 
                value={newOrderData.orderAddress}
                onChange={(e) => setNewOrderData({...newOrderData, orderAddress: e.target.value})}
                placeholder="Enter delivery address"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOrderOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700" 
              onClick={handleCreateOrder}
              disabled={!newOrderData.productName || !newOrderData.unitPrice || !newOrderData.quantity || !newOrderData.orderAddress}
            >
              Create Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderManagement;