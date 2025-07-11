import { config } from "@/config/env"
import axios from "axios"

class ApiService {
  constructor() {
    this._instance = null
    this._authStore = null // Will be set by auth store
  }

  // Set auth store reference for logout functionality
  setAuthStore(authStore) {
    this._authStore = authStore
  }

  _getAxiosInstance() {
    if (!this._instance) {
      this._instance = axios.create({
        baseURL: config.apiBaseUrl,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })

      // Request interceptor - add token and check expiry
      this._instance.interceptors.request.use(
        (config) => {
          const token = this.getToken()
          if (token) {
            // Check if token is expired before making request
            if (this.isTokenExpired(token)) {
              this.handleTokenExpiry()
              return Promise.reject(new Error("Token expired"))
            }
            config.headers.Authorization = `Bearer ${token}`
          }
          return config
        },
        (error) => Promise.reject(error),
      )

      // Response interceptor - handle 401 errors
      this._instance.interceptors.response.use(
        (response) => {
          // Return the full response data instead of just response.data
          return response.data
        },
        (error) => {
          // Handle 401 Unauthorized responses
          if (error.response?.status === 401) {
            this.handleTokenExpiry()
          }

          console.error("API Error:", error.response || error)
          return Promise.reject(error)
        },
      )
    }
    return this._instance
  }

  // Check if JWT token is expired
  isTokenExpired(token) {
    if (!token) return true

    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      const currentTime = Date.now() / 1000

      // Check if token expires within next 5 minutes (300 seconds)
      return payload.exp < currentTime + 300
    } catch (error) {
      console.error("Error parsing token:", error)
      return true
    }
  }

  // Handle token expiry - use silent logout
  handleTokenExpiry() {
    this.removeToken()

    // Call silent logout from auth store if available
    if (this._authStore) {
      this._authStore.getState().silentLogout()
    }

    // Only redirect if not already on signin page
    if (window.location.pathname !== "/signin") {
      window.location.href = "/signin"
    }
  }

  // HTTP methods
  async get(url, params = {}) {
    return this._getAxiosInstance().get(url, { params })
  }

  async post(url, data = {}, headers = {}) {
    return this._getAxiosInstance().post(url, data, { headers })
  }

  async put(url, data = {}) {
    return this._getAxiosInstance().put(url, data)
  }

  async patch(url, data = {}) {
    return this._getAxiosInstance().patch(url, data)
  }

  async delete(url) {
    return this._getAxiosInstance().delete(url)
  }

  // Token management with expiry checking
  setToken(token) {
    if (!token) return

    // Validate token format
    if (token.split(".").length !== 3) {
      console.error("Invalid JWT token format")
      return
    }

    localStorage.setItem("auth-token", token)

    // Set up automatic token refresh check
    this.scheduleTokenCheck(token)
  }

  removeToken() {
    localStorage.removeItem("auth-token")
    this.clearTokenCheck()
  }

  getToken() {
    return localStorage.getItem("auth-token")
  }

  // Check if token exists and is valid
  hasValidToken() {
    const token = this.getToken()
    return token && !this.isTokenExpired(token)
  }

  // Schedule periodic token expiry checks
  scheduleTokenCheck(token) {
    this.clearTokenCheck()

    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      const expiryTime = payload.exp * 1000
      const currentTime = Date.now()
      const timeUntilExpiry = expiryTime - currentTime

      // Check token 5 minutes before expiry
      const checkTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 1000)

      this._tokenCheckTimeout = setTimeout(() => {
        if (this.isTokenExpired(token)) {
          this.handleTokenExpiry()
        }
      }, checkTime)
    } catch (error) {
      console.error("Error scheduling token check:", error)
    }
  }

  clearTokenCheck() {
    if (this._tokenCheckTimeout) {
      clearTimeout(this._tokenCheckTimeout)
      this._tokenCheckTimeout = null
    }
  }
}

const apiService = new ApiService()
export default apiService
