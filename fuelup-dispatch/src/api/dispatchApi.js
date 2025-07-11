import apiService from "@/lib/api"

export const dispatchApi = {
  // Get assigned deliveries
  // getAssignments: async () => {
  //   return await apiService.get("/dispatch/assignments")
  // },

  getAssignments: async () => {
  return {
    status: "success",
    data: [
      {
        id: "order_001",
        customerId: "cust_001",
        riderId: "rider_123",
        status: "assigned",
        address: "23 Orchid Road, Lekki Phase 1, Lagos",
        latitude: "6.4304",
        longitude: "3.4216",
        created_at: "2025-07-11T09:00:00Z"
      },
      {
        id: "order_002",
        customerId: "cust_002",
        riderId: "rider_123",
        status: "accepted",
        address: "7 Chevron Drive, Lekki Phase 2, Lagos",
        latitude: "6.4467",
        longitude: "3.4560",
        created_at: "2025-07-11T10:30:00Z"
      },
      {
        id: "order_003",
        customerId: "cust_003",
        riderId: "rider_123",
        status: "in_progress",
        address: "12 Sangotedo Street, Ajah, Lagos",
        latitude: "6.4654",
        longitude: "3.4322",
        created_at: "2025-07-11T11:00:00Z"
      }
    ]
  }
},

  // Get completed deliveries
  getCompletedDeliveries: async () => {
    return await apiService.get("/dispatch/deliveries/completed")
  },

  // Accept delivery
  acceptDelivery: async (orderId) => {
    return await apiService.post(`/dispatch/orders/${orderId}/accept`)
  },

  // Start delivery
  startDelivery: async (orderId) => {
    return await apiService.post(`/dispatch/orders/${orderId}/start`)
  },

  // Confirm delivery
  confirmDelivery: async (orderId, formData) => {
    return await apiService.post(`/dispatch/orders/${orderId}/confirm`, formData, {
      "Content-Type": "multipart/form-data",
    })
  },

  // Update rider status
  updateRiderStatus: async (status) => {
    return await apiService.post("/dispatch/status", { status })
  },

  // Get order details
  getOrderDetails: async (orderId) => {
    return await apiService.get(`/dispatch/orders/${orderId}`)
  },
}
