// src/stores/useAuthStore.js
import apiService from '@/lib/api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      authenticated: false,
      loading: false,
      error: null,
      tempEmail: null,
      tempOtp: null,
      
      setTempEmail: (email) => {
        set({ tempEmail: email });
      },

      setTempOtp: (otp) => {
        set({ tempOtp: otp });
      },

      clearTempData: () => {
        set({ 
          tempEmail: null,
          tempOtp: null 
        });
      },

      // Set user data
      setUser: (userData) => {
        set({ user: userData });
      },

      // Login Action
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await apiService.post('/auth/login', { email, password });
          
          // Handle successful login with the correct response structure
          if (response.data?.accessToken) {
            apiService.setToken(response.data.accessToken);
            
            // Get user data
            const userData = await apiService.get('/users/me');
            set({ 
              user: userData.data,
              authenticated: true,
              loading: false,
            });
            return { success: true, user: userData.data };
          } else if (response.message === "EMAIL_NOT_VERIFIED") {
            set({ 
              loading: false, 
              error: "EMAIL_NOT_VERIFIED",
            });
            return { success: false, error: "EMAIL_NOT_VERIFIED" };
          }
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Login failed',
            loading: false,
            authenticated: false,
            user: null
          });
          return { success: false, error: error.response?.data?.message || 'Login failed' };
        }
      },

      // Register Action
      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          const response = await apiService.post('/auth/signup', userData);
          set({ 
            tempEmail: userData.email,
            loading: false,
            error: null
          });
          return { success: true, email: userData.email };
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Registration failed', 
            loading: false 
          });
          throw error;
        }
      },

      // Verify Email
      verifyEmail: async (email, otp) => {
        set({ loading: true, error: null });
        try {
          const response = await apiService.post('/auth/signup-verification', { email, otp });
          set({ loading: false });
          return { success: true, data: response.responseBody };
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Email verification failed',
            loading: false
          });
          throw error;
        }
      },

      // Resend OTP
      resendOtp: async (email) => {
        set({ error: null });
        try {
          const response = await apiService.post('/auth/resend-otp', { email });
          return response.responseBody;
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Failed to resend OTP',
          });
          throw error;
        }
      },
      
      // Forgot Password
      forgotPassword: async (email) => {
        set({
          loading: true,
          error: null,
          tempEmail: email
        });
        try {
          const response = await apiService.post('/auth/forgot-password', { email });
          set({ loading: false });
          return true;
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Failed to process request',
            loading: false
          });
          throw error;
        }
      },

      // Reset Password
      resetPassword: async (password, otp) => {
        set({ loading: true, error: null });
        try {
          const response = await apiService.post('/auth/reset-password', {
            otp: otp,
            password
          });
          set({ 
            loading: false,
            tempOtp: null
          });
          return response.responseBody;
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Failed to reset password',
            loading: false
          });
          throw error;
        }
      },

      // Check Authentication Status
      checkAuth: async () => {
        set({ loading: true });
        try {
          // Skip check if no token exists
          if (!apiService.getToken()) {
            set({ user: null, authenticated: false, loading: false });
            return false;
          }
          
          // Get user profile directly instead of checking login status
          try {
            const userData = await apiService.get('/users/me');
            set({ 
              user: userData.data,
              authenticated: true,
              loading: false
            });
            return true;
          } catch (error) {
            // If the request fails, the token is invalid
            apiService.removeToken();
            set({ 
              user: null,
              authenticated: false,
              loading: false
            });
            return false;
          }
        } catch (error) {
          apiService.removeToken();
          set({ 
            error: error.response?.data?.message || 'Check Auth failed',
            user: null,
            authenticated: false,
            loading: false
          });  
          return false;
        }
      },

      // Logout
      logout: () => {
        // Remove the token from storage
        apiService.removeToken();
        
        // Reset the auth state
        set({ 
          user: null, 
          authenticated: false,
          loading: false
        });
      },

      // Update User Profile
      updateProfile: async (formData) => {
        set({ error: null });
        try {
          const response = await apiService.put('/users/me', formData, {
            'Content-Type': 'multipart/form-data'
          });
          
          if (response.data) {
            set({ 
              user: {
                ...response.data,
                profile_image_url: response.data.profile_image_url || response.data.media?.[0]?.original_url
              }
            });
            return response.data;
          }
        } catch (error) {
          console.error('Profile update error:', error);
          set({ 
            error: error.response?.data?.message || 'Failed to update profile'
          });
          throw error;
        }
      },

      // Add Address
      addAddress: async (addressData) => {
        set({ loading: true, error: null });
        try {
          const response = await apiService.post('/users/address', addressData);
          
          // Update user with new address
          const currentUser = get().user;
          const updatedAddresses = [...(currentUser.addresses || []), response.data];
          
          set({ 
            user: {
              ...currentUser,
              addresses: updatedAddresses
            },
            loading: false
          });
          
          return { success: true, address: response.data };
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Failed to add address',
            loading: false
          });
          throw error;
        }
      },

      // Update Address
      updateAddress: async (addressId, addressData) => {
        set({ loading: true, error: null });
        try {
          const response = await apiService.put(`/users/address/${addressId}`, addressData);
          
          // Update user with modified address
          const currentUser = get().user;
          const updatedAddresses = currentUser.addresses.map(addr => 
            addr._id === addressId ? response.data : addr
          );
          
          set({ 
            user: {
              ...currentUser,
              addresses: updatedAddresses
            },
            loading: false
          });
          
          return { success: true, address: response.data };
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Failed to update address',
            loading: false
          });
          throw error;
        }
      },

      // Delete Address
      deleteAddress: async (addressId) => {
        set({ loading: true, error: null });
        try {
          await apiService.delete(`/users/address/${addressId}`);
          
          // Update user by removing address
          const currentUser = get().user;
          const updatedAddresses = currentUser.addresses.filter(addr => addr._id !== addressId);
          
          set({ 
            user: {
              ...currentUser,
              addresses: updatedAddresses
            },
            loading: false
          });
          
          return { success: true };
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Failed to delete address',
            loading: false
          });
          throw error;
        }
      },

      // Set Default Address
      setDefaultAddress: async (addressId) => {
        set({ loading: true, error: null });
        try {
          await apiService.put(`/users/address/${addressId}/default`);
          
          // Update user addresses with new default
          const currentUser = get().user;
          const updatedAddresses = currentUser.addresses.map(addr => ({
            ...addr,
            isDefault: addr._id === addressId
          }));
          
          set({ 
            user: {
              ...currentUser,
              addresses: updatedAddresses
            },
            loading: false
          });
          
          return { success: true };
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Failed to set default address',
            loading: false
          });
          throw error;
        }
      },

      // Change Password
      changePassword: async (newPassword) => {
        set({ loading: true, error: null });
        try {
          const response = await apiService.patch('/users/password-change', {
            newPassword
          });
          set({ loading: false });
          return { success: true, data: response.data };
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Failed to change password',
            loading: false
          });
          throw error;
        }
      }, 
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        tempEmail: state.tempEmail,
        tempOtp: state.tempOtp, 
        user: state.user,
        authenticated: state.authenticated
      })
    }
  )
);

export default useAuthStore;