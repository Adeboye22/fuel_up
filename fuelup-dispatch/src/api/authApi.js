import apiService from "@/lib/api"

export const authApi = {
  // Login - Updated endpoint
  login: async (credentials) => {
    return await apiService.post("/auth/login", credentials)
  },

  // Get current user profile
  getProfile: async () => {
    return await apiService.get("/dispatch/profile")
  },

  // Update profile
  updateProfile: async (profileData) => {
    return await apiService.put("/dispatch/profile", profileData)
  },

  // Logout
  logout: async () => {
    return await apiService.post("/auth/logout")
  },
}
