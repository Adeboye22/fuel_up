/**
 * Notification Service for FuelUp Dispatch System
 * Handles SMS, push notifications, and customer communications
 */

class NotificationService {
  constructor() {
    this.apiBaseUrl = process.env.VITE_API_BASE_URL || "http://localhost:8000/api"
  }

  /**
   * Send pre-delivery notification to customer
   * @param {string} orderId - Order ID
   * @returns {Promise} - Notification result
   */
  async sendPreDeliveryNotification(orderId) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/notifications/pre-delivery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify({ orderId }),
      })

      const result = await response.json()

      if (result.success) {
        console.log("Pre-delivery notification sent successfully")
        return { success: true }
      } else {
        throw new Error(result.message || "Failed to send notification")
      }
    } catch (error) {
      console.error("Pre-delivery notification failed:", error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Send rider change notification to customer
   * @param {string} customerId - Customer ID
   * @param {string} newRiderId - New rider ID
   * @returns {Promise} - Notification result
   */
  async sendRiderChangeNotification(customerId, newRiderId) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/notifications/rider-change`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify({
          customerId,
          newRiderId,
          message:
            "Your delivery rider has been changed due to shift handover. You will receive updated tracking information shortly.",
        }),
      })

      const result = await response.json()
      return { success: result.success }
    } catch (error) {
      console.error("Rider change notification failed:", error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Send delivery delay notification
   * @param {string} orderId - Order ID
   * @param {number} delayMinutes - Delay in minutes
   * @param {string} reason - Reason for delay
   * @returns {Promise} - Notification result
   */
  async sendDelayNotification(orderId, delayMinutes, reason = "Traffic conditions") {
    try {
      const response = await fetch(`${this.apiBaseUrl}/notifications/delay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify({
          orderId,
          delayMinutes,
          reason,
          message: `Your fuel delivery is delayed by approximately ${delayMinutes} minutes due to ${reason}. We apologize for the inconvenience.`,
        }),
      })

      const result = await response.json()
      return { success: result.success }
    } catch (error) {
      console.error("Delay notification failed:", error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Send arrival notification (rider is nearby)
   * @param {string} orderId - Order ID
   * @param {number} etaMinutes - ETA in minutes
   * @returns {Promise} - Notification result
   */
  async sendArrivalNotification(orderId, etaMinutes = 5) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/notifications/arrival`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify({
          orderId,
          etaMinutes,
          message: `Your FuelUp rider is ${etaMinutes} minutes away! Please be available to receive your fuel delivery.`,
        }),
      })

      const result = await response.json()
      return { success: result.success }
    } catch (error) {
      console.error("Arrival notification failed:", error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Send batch delivery notification (multiple orders in same trip)
   * @param {Array} orderIds - Array of order IDs in the batch
   * @param {string} riderId - Rider ID
   * @returns {Promise} - Notification result
   */
  async sendBatchDeliveryNotification(orderIds, riderId) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/notifications/batch-delivery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify({
          orderIds,
          riderId,
          message:
            "Your order has been batched with other deliveries in your area for faster service. You will receive individual tracking updates.",
        }),
      })

      const result = await response.json()
      return { success: result.success }
    } catch (error) {
      console.error("Batch delivery notification failed:", error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Send customer unavailable notification to admin
   * @param {string} orderId - Order ID
   * @param {string} riderId - Rider ID
   * @param {number} attemptCount - Number of contact attempts
   * @returns {Promise} - Notification result
   */
  async sendCustomerUnavailableAlert(orderId, riderId, attemptCount = 3) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/notifications/customer-unavailable`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify({
          orderId,
          riderId,
          attemptCount,
          message: `Customer unavailable for Order #${orderId}. Rider attempted contact ${attemptCount} times. Requires admin intervention.`,
        }),
      })

      const result = await response.json()
      return { success: result.success }
    } catch (error) {
      console.error("Customer unavailable alert failed:", error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Send delivery completion notification
   * @param {string} orderId - Order ID
   * @param {string} deliveryTime - Actual delivery time
   * @returns {Promise} - Notification result
   */
  async sendDeliveryCompletionNotification(orderId, deliveryTime) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/notifications/delivery-complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify({
          orderId,
          deliveryTime,
          message: `Your fuel has been delivered successfully! Thank you for choosing FuelUp. Rate your experience in the app.`,
        }),
      })

      const result = await response.json()
      return { success: result.success }
    } catch (error) {
      console.error("Delivery completion notification failed:", error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Send emergency alert to admin and backup systems
   * @param {string} riderId - Rider ID
   * @param {Object} location - GPS coordinates
   * @param {string} emergencyType - Type of emergency
   * @returns {Promise} - Notification result
   */
  async sendEmergencyAlert(riderId, location, emergencyType = "general") {
    try {
      const response = await fetch(`${this.apiBaseUrl}/notifications/emergency`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify({
          riderId,
          location,
          emergencyType,
          timestamp: new Date().toISOString(),
          message: `EMERGENCY ALERT: Rider ${riderId} has triggered an emergency alert. Location: ${location.lat}, ${location.lng}`,
        }),
      })

      const result = await response.json()
      return { success: result.success }
    } catch (error) {
      console.error("Emergency alert failed:", error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Mock SMS sending for development (replace with actual SMS service)
   * @param {string} phoneNumber - Customer phone number
   * @param {string} message - SMS message
   * @returns {Promise} - SMS result
   */
  async sendSMS(phoneNumber, message) {
    // In production, integrate with SMS service like Twilio, Termii, or local SMS gateway
    console.log(`SMS to ${phoneNumber}: ${message}`)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      success: true,
      messageId: `sms_${Date.now()}`,
      status: "sent",
    }
  }

  /**
   * Send push notification (for mobile app integration)
   * @param {string} userId - User ID
   * @param {string} title - Notification title
   * @param {string} body - Notification body
   * @param {Object} data - Additional data
   * @returns {Promise} - Push notification result
   */
  async sendPushNotification(userId, title, body, data = {}) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/notifications/push`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify({
          userId,
          title,
          body,
          data,
        }),
      })

      const result = await response.json()
      return { success: result.success }
    } catch (error) {
      console.error("Push notification failed:", error)
      return { success: false, error: error.message }
    }
  }
}

// Create singleton instance
const notificationService = new NotificationService()

export { notificationService }
export default NotificationService
