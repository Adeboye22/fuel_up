"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import useAuthStore from "@/stores/useAuthStore"

const SessionTimeoutWarning = () => {
  const [showWarning, setShowWarning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const { sessionExpiry, logout } = useAuthStore()

  useEffect(() => {
    if (!sessionExpiry) return

    const checkSessionExpiry = () => {
      const now = Date.now()
      const timeUntilExpiry = sessionExpiry - now

      // Show warning 5 minutes before expiry
      if (timeUntilExpiry <= 5 * 60 * 1000 && timeUntilExpiry > 0) {
        setShowWarning(true)
        setTimeLeft(Math.ceil(timeUntilExpiry / 1000))
      } else if (timeUntilExpiry <= 0) {
        logout()
      } else {
        setShowWarning(false)
      }
    }

    const interval = setInterval(checkSessionExpiry, 1000)
    return () => clearInterval(interval)
  }, [sessionExpiry, logout])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleExtendSession = async () => {
    try {
      // You can implement token refresh here if your API supports it
      // For now, we'll just hide the warning
      setShowWarning(false)
    } catch (error) {
      console.error("Failed to extend session:", error)
      logout()
    }
  }

  return (
    <AnimatePresence>
      {showWarning && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 z-50 bg-yellow-500 text-black p-4 rounded-lg shadow-lg max-w-sm"
        >
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-medium">Session Expiring</h3>
              <p className="text-sm">Your session will expire in {formatTime(timeLeft)}</p>
            </div>
          </div>
          <div className="mt-3 flex space-x-2">
            <button
              onClick={handleExtendSession}
              className="bg-black text-yellow-500 px-3 py-1 rounded text-sm hover:bg-gray-800"
            >
              Stay Logged In
            </button>
            <button onClick={logout} className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700">
              Logout
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SessionTimeoutWarning
