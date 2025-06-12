import apiService from '@/lib/api';
import { create } from 'zustand';
import toast from 'react-hot-toast';

const useOrderStore = create((set, get) => ({
  orders: [],
  ordersPagination: {
    data: [],
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    pageSize: 5,
    hasNextPage: false,
    hasPreviousPage: false
  },
  currentOrder: null,
  loading: false,
  error: null,
  
  // Fetch user orders with pagination
  fetchOrders: async (url = '/orders/user') => {
    set({ loading: true, error: null });
    try {
      const response = await apiService.get(url);
      
      if (response.status === 'success') {
        set({
          orders: response.data?.data || [],
          ordersPagination: response.data || {},
          loading: false
        });
        return response;
      } else {
        throw new Error(response.message || 'Failed to fetch orders');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch orders';
      set({
        error: errorMessage,
        loading: false
      });
      toast.error(errorMessage);
      throw error;
    }
  },
  
  // Create a new order
  createOrder: async (orderData) => {
    set({ loading: true, error: null });
    try {
      const response = await apiService.post('/orders', orderData);
      
      // Add the new order to the orders list if successful
      if (response.status === 'success') {
        const currentOrders = get().orders;
        set({
          orders: [response.data, ...currentOrders],
          currentOrder: response.data,
          loading: false
        });
        toast.success('Order created successfully');
      } else {
        throw new Error(response.message || 'Order creation failed');
      }
      
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create order';
      set({
        error: errorMessage,
        loading: false
      });
      toast.error(errorMessage);
      throw error;
    }
  },
  
  // Get order by ID
  getOrderById: async (orderId) => {
    set({ loading: true, error: null });
    try {
      const response = await apiService.get(`/orders/${orderId}`);
      
      if (response.status === 'success') {
        set({
          currentOrder: response.data,
          loading: false
        });
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to get order details');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to get order details';
      set({
        error: errorMessage,
        loading: false
      });
      toast.error(errorMessage);
      throw error;
    }
  },
  
  // Cancel order
  cancelOrder: async (orderId) => {
    set({ loading: true, error: null });
    try {
      const response = await apiService.put(`/orders/${orderId}/cancel`);
      
      // Update the order in orders list
      if (response.status === 'success') {
        const currentOrders = get().orders;
        const updatedOrders = currentOrders.map(order => 
          order._id === orderId ? response.data : order
        );
        
        set({
          orders: updatedOrders,
          currentOrder: response.data,
          loading: false
        });
        toast.success('Order cancelled successfully');
        return response;
      } else {
        throw new Error(response.message || 'Failed to cancel order');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to cancel order';
      set({
        error: errorMessage,
        loading: false
      });
      toast.error(errorMessage);
      throw error;
    }
  },
  
  // Clear current order
  clearCurrentOrder: () => {
    set({ currentOrder: null });
  }
}));

export default useOrderStore;