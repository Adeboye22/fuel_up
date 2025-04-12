import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      tempEmail: null,
      tempOtp: null, // Add OTP storage
      
      setTempEmail: (email) => {
        set({ tempEmail: email });
      },

      setTempOtp: (otp) => {  // Add setter for OTP
        set({ tempOtp: otp });
      },

      clearTempData: () => {  // Clear both email and OTP
        set({ 
          tempEmail: null,
          tempOtp: null 
        });
      },

      // Login Action
      login: async (email, password, recaptchaToken) => {
        set({ loading: true, error: null });
        try {
          const response = await apiService.post('/auth/login', { email, password, recaptcha_token: recaptchaToken });

          if (response.responseBody === "EMAIL_NOT_VERIFIED") {
            set({ 
              loading: false, 
              error: "EMAIL_NOT_VERIFIED",
            });
            return { success: false, error: "EMAIL_NOT_VERIFIED", email };
          }

          const { responseBody: userData } = await apiService.get('/user');
          set({ 
            user: userData,
            authenticated: true,
            loading: false,
          });
          return { success: true, user: userData };
        } catch (error) {
          set({
            error: error.response?.data?.responseBody,
            loading: false,
            authenticated: false,
            user: null
          });
          return { success: false, error: error.response?.data?.responseBody };
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

      // Rest of the store methods remain the same...
      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          await apiService.post('/auth/register', userData);
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

      checkAuth: async () => {
        set({ loading: true });
        try {
          const { responseBody: { isLoggedIn } } = await apiService.get('/auth/check-login-status');
          if (isLoggedIn) {
            const { responseBody: userData } = await apiService.get('/user');
            set({ 
              user: userData,
              authenticated: true,
              loading: false
            });
          } else {
            set({ 
              user: null,
              authenticated: false,
              loading: false
            });
          }
          return isLoggedIn;
        } catch (error) {
          set({ 
            error: error.response?.data?.message || 'Check Auth failed',
            user: null,
            authenticated: false,
            loading: false
          });  
          return false;
        }
      },

      logout: async () => {
        set({ loading: true });
        try {
          await apiService.post('/logout');
        }
        catch (error) {
          set({ 
            error: error.response?.data?.message || 'Logout failed',
            loading: false
          });
        }
        finally {
          set({ 
            user: null, 
            authenticated: false,
            loading: false
          });
        }
      },

      updateProfile: async (formData) => {
        set({ 
          // loading: true,
          error: null });
        try {
          const response = await apiService.post('/user/profile/update', formData, {'Content-Type': 'multipart/form-data'});
          
          if (response.responseBody) {
            set({ 
              user: {
                ...response.responseBody,
                profile_image_url: response.responseBody.profile_image_url || response.responseBody.media?.[0]?.original_url
              }, 
            });
            return response.responseBody;
          }
        } catch (error) {
          console.error('Profile update error:', error);
          set({ 
            error: error.response?.responseBody?.message || 'Failed to update profile', 
          });
          throw error;
        }
      },

      verifyEmail: async (email, otp) => {
        set({ loading: true, error: null });
        try {
          const response = await apiService.post('/auth/verify-email', { email, otp });
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

      verifyOtp: async (email, otp) => {
        set({ 
          error: null
        });
        try {
          const response = await apiService.post('/auth/verify-reset-otp', { email, otp });
          return { success: true, data: response.responseBody };
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Otp verification failed',
          });
          throw error;
        }
      },

      resendOtp: async (email) => {
        set({ 
          // loading: true, 
          error: null });
        try {
          const response = await apiService.post('/auth/resend-otp', { email });
          // set({ loading: false });
          return response.responseBody;
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Failed to resend OTP',
            // loading: false
          });
          throw error;
        }
      },

      resetPassword: async (password, passwordConfirmation) => {
        const state = get();
        set({ loading: true, error: null });
        try {
          const response = await apiService.post('/auth/reset-password', {
            email: state.tempEmail,
            otp: state.tempOtp,
            password,
            password_confirmation: passwordConfirmation
          });
          set({ 
            loading: false,
            tempEmail: null,
            tempOtp: null  // Clear OTP after successful reset
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

      changePassword: async (currentPassword, newPassword, passwordConfirmation) => {
        set({ loading: true, error: null });
        try {
          const response = await apiService.post('/user/change-password', {
            current_password: currentPassword,
            password: newPassword,
            password_confirmation: passwordConfirmation
          });
          set({ loading: false });
          return response.responseBody;
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