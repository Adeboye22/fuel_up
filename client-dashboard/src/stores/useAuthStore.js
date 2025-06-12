import apiService from '@/lib/api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

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
          
          // First verify if login was successful
          if (response.status === 'success' && response.data?.accessToken) {
            // Check if the user has admin role
            if (response.data.role !== 'admin') {
              // Not an admin - don't set token or authenticate
              set({
                error: "Access denied. Admin privileges required.",
                loading: false,
                authenticated: false,
                user: null
              });
              
              // Show toast notification
              toast.error("Access denied. Admin privileges required.", {
                duration: 5000
              });
              
              return { 
                success: false, 
                error: "Access denied. Admin privileges required."
              };
            }
            
            // User is an admin, proceed with authentication
            apiService.setToken(response.data.accessToken);
            
            // Get user data
            try {
              const userData = await apiService.get('/users/me');
              set({ 
                user: {...userData.data, role: response.data.role},
                authenticated: true,
                loading: false,
              });
              
              // Success toast notification
              toast.success("Successfully logged in", {
                duration: 3000
              });
              
              return { success: true, user: userData.data };
              
            } catch (userDataError) {
              // Failed to get user data
              apiService.removeToken();
              set({
                error: "Failed to retrieve user data",
                loading: false,
                authenticated: false,
                user: null
              });
              
              toast.error("Authentication failed", {
                duration: 3000
              });
              
              return { 
                success: false, 
                error: "Failed to retrieve user data"
              };
            }
          } else {
            // Login response wasn't successful
            set({
              error: "Invalid credentials",
              loading: false,
              authenticated: false,
              user: null
            });
            
            toast.error("Invalid credentials", {
              duration: 3000
            });
            
            return { 
              success: false, 
              error: "Invalid credentials"
            };
          }
        } catch (error) {
          // Handle validation errors specifically (status 400 with message array)
          if (error.response?.status === 400 && Array.isArray(error.response.data?.message)) {
            const validationMessages = error.response.data.message;
            const errorMessage = validationMessages.join(', ');
            
            set({
              error: errorMessage,
              loading: false,
              authenticated: false,
              user: null
            });
            
            toast.error(errorMessage, {
              duration: 3000
            });
            
            return { 
              success: false, 
              error: errorMessage
            };
          }
          
          // Handle other errors
          const errorMessage = error.response?.data?.message || error.message || 'Login failed';
          set({
            error: errorMessage,
            loading: false,
            authenticated: false,
            user: null
          });
          
          toast.error(errorMessage, {
            duration: 3000
          });
          
          return { 
            success: false, 
            error: errorMessage
          };
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
            
            // Verify admin role before setting authenticated
            if (userData.data?.role === 'admin') {
              set({ 
                user: userData.data,
                authenticated: true,
                loading: false
              });
              return true;
            } else {
              // Not an admin - clear token and auth state
              apiService.removeToken();
              set({ 
                user: null,
                authenticated: false,
                loading: false,
                error: "Admin access required"
              });
              
              // Show toast notification
              toast.error("Access denied. Admin privileges required.", {
                duration: 5000
              });
              
              return false;
            }
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
        
        // Show toast notification
        toast.success("Logged out successfully", {
          duration: 3000
        });
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