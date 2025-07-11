import { create } from "zustand"
import { persist } from "zustand/middleware"
import apiService from "@/lib/api"
import { authApi } from "@/api/authApi"
import toast from "react-hot-toast"

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      authenticated: false,
      loading: false,
      isInitialized: false,

      // Set auth store reference in API service
      init: () => {
        apiService.setAuthStore({ getState: get })
        // Check if we have persisted auth data
        const state = get()
        if (state.authenticated && state.user) {
          set({ isInitialized: true })
          // Verify token is still valid
          get().checkAuth()
        } else {
          set({ isInitialized: true })
        }
      },

      // Login function - updated to handle form object
      login: async (formData) => {
        set({ loading: true })
        try {
          // Extract credentials from form data
          const credentials = {
            email: formData.email,
            password: formData.password,
          }

          const response = await authApi.login(credentials)

          if (response.status === "success" && response.data) {
            const { accessToken, role } = response.data

            // Verify user has driver role
            if (role !== "driver") {
              throw new Error("Access denied. Driver role required.")
            }

            // Set token first
            apiService.setToken(accessToken)

            // Try to fetch user profile
            try {
              const profileResponse = await authApi.getProfile()
              if (profileResponse.status === "success") {
                const user = {
                  ...profileResponse.data,
                  role: role,
                }

                set({
                  user,
                  authenticated: true,
                  loading: false,
                  isInitialized: true,
                })
              } else {
                // Fallback if profile fetch fails
                const user = {
                  role: role,
                  // Add any other data from login response
                  ...response.data,
                }

                set({
                  user,
                  authenticated: true,
                  loading: false,
                  isInitialized: true,
                })
              }
            } catch (profileError) {
              console.warn("Could not fetch profile, using login data:", profileError)
              // Fallback to login response data
              const user = {
                role: role,
                ...response.data,
              }

              set({
                user,
                authenticated: true,
                loading: false,
                isInitialized: true,
              })
            }

            toast.success("Welcome back, driver!")
            return { success: true }
          } else {
            throw new Error(response.message || "Login failed")
          }
        } catch (error) {
          set({ loading: false, isInitialized: true })
          const message = error.response?.data?.message || error.message || "Login failed"
          toast.error(message)
          return { success: false, message }
        }
      },

      // Silent logout function (no toast)
      silentLogout: () => {
        apiService.removeToken()
        set({
          user: null,
          authenticated: false,
          loading: false,
          isInitialized: true,
        })
      },

      // Logout function with toast
      logout: async (showToast = true) => {
        try {
          // Try to call logout API
          await authApi.logout()
        } catch (error) {
          console.warn("Logout API call failed:", error)
        }

        apiService.removeToken()
        set({
          user: null,
          authenticated: false,
          loading: false,
          isInitialized: true,
        })

        if (showToast) {
          toast.success("Logged out successfully")
        }
      },

      // Check authentication status - improved version
      checkAuth: async () => {
        const token = apiService.getToken()
        const currentState = get()

        // If no token, logout silently
        if (!token) {
          if (currentState.authenticated) {
            get().silentLogout()
          } else {
            set({ isInitialized: true })
          }
          return
        }

        // If token is expired, logout silently
        if (apiService.isTokenExpired(token)) {
          get().silentLogout()
          return
        }

        // If we already have user data and token is valid, just mark as initialized
        if (currentState.authenticated && currentState.user) {
          set({ isInitialized: true })
          return
        }

        // Try to fetch user profile to verify token
        try {
          const response = await authApi.getProfile()
          if (response.status === "success" && response.data) {
            const user = response.data

            // Check if user has driver role
            if (user.role === "driver") {
              set({
                authenticated: true,
                user: user,
                isInitialized: true,
              })
            } else {
              // Silent logout for wrong role
              get().silentLogout()
            }
          } else {
            // Silent logout if profile fetch fails
            get().silentLogout()
          }
        } catch (error) {
          console.error("Error checking auth:", error)
          // Only logout if it's a 401 error, otherwise keep current state
          if (error.response?.status === 401) {
            get().silentLogout()
          } else {
            // Network error or other issue - keep current state but mark as initialized
            set({ isInitialized: true })
          }
        }
      },

      // Update user profile
      updateProfile: async (profileData) => {
        set({ loading: true })
        try {
          const response = await authApi.updateProfile(profileData)

          if (response.status === "success") {
            set((state) => ({
              user: { ...state.user, ...response.data },
              loading: false,
            }))
            toast.success("Profile updated successfully!")
            return { success: true }
          }
        } catch (error) {
          set({ loading: false })
          const message = error.response?.data?.message || "Profile update failed"
          toast.error(message)
          return { success: false, message }
        }
      },
    }),
    {
      name: "dispatch-auth-storage",
      partialize: (state) => ({
        user: state.user,
        authenticated: state.authenticated,
      }),
      // Add onRehydrateStorage to handle state restoration
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Mark as initialized after rehydration
          state.isInitialized = true
        }
      },
    },
  ),
)

export default useAuthStore
