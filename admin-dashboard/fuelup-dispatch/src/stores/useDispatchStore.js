import { create } from "zustand"
import { dispatchApi } from "@/api/dispatchApi"
import toast from "react-hot-toast"
import { detectSimilarAddresses } from "@/utils/addressValidation"
import { calculateOptimalBatches } from "@/utils/calculatedEstimatedTime"

const useDispatchStore = create((set, get) => ({
  // State
  assignments: [],
  completedDeliveries: [],
  currentOrder: null,
  riderStatus: "offline",
  loading: false,

  // Fetch assigned deliveries
  // fetchAssignments: async () => {
  //   set({ loading: true })
  //   try {
  //     const response = await dispatchApi.getAssignments()
  //     if (response.status === "success") {
  //       set({
  //         assignments: response.data || [],
  //         loading: false,
  //       })
  //     }
  //   } catch (error) {
  //     set({ loading: false })
  //     console.error("Error fetching assignments:", error)
  //   }
  // },

  fetchAssignments: async () => {
  set({ loading: true })
  try {
    // Simulate mock API fetch from public folder
    const response = await fetch("/mock/assignments.json")
    const data = await response.json()

    set({
      assignments: data,
      loading: false,
    })
  } catch (error) {
    set({ loading: false })
    console.error("Error fetching assignments:", error)
  }
},

  // Fetch completed deliveries
  fetchCompletedDeliveries: async () => {
    set({ loading: true })
    try {
      const response = await dispatchApi.getCompletedDeliveries()
      if (response.status === "success") {
        set({
          completedDeliveries: response.data || [],
          loading: false,
        })
      }
    } catch (error) {
      set({ loading: false })
      console.error("Error fetching completed deliveries:", error)
    }
  },

  // Accept delivery assignment
  acceptDelivery: async (orderId) => {
    try {
      const response = await dispatchApi.acceptDelivery(orderId)
      if (response.status === "success") {
        toast.success("Delivery accepted!")
        get().fetchAssignments()
        return { success: true }
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to accept delivery"
      toast.error(message)
      return { success: false, message }
    }
  },

  // Start delivery
  startDelivery: async (orderId) => {
    try {
      const response = await dispatchApi.startDelivery(orderId)
      if (response.status === "success") {
        toast.success("Delivery started!")
        get().fetchAssignments()
        return { success: true }
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to start delivery"
      toast.error(message)
      return { success: false, message }
    }
  },

  // Confirm delivery with OTP and photo
  confirmDelivery: async (orderId, confirmationData) => {
    try {
      const formData = new FormData()
      formData.append("otp", confirmationData.otp)
      if (confirmationData.proofPhoto) {
        formData.append("proof_photo", confirmationData.proofPhoto)
      }

      const response = await dispatchApi.confirmDelivery(orderId, formData)

      if (response.status === "success") {
        toast.success("Delivery confirmed successfully!")
        get().fetchAssignments()
        get().fetchCompletedDeliveries()
        return { success: true }
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to confirm delivery"
      toast.error(message)
      return { success: false, message }
    }
  },

  // Toggle rider online/offline status
  toggleRiderStatus: async () => {
    const currentStatus = get().riderStatus
    const newStatus = currentStatus === "online" ? "offline" : "online"

    try {
      const response = await dispatchApi.updateRiderStatus(newStatus)
      if (response.status === "success") {
        set({ riderStatus: newStatus })
        toast.success(`You are now ${newStatus}`)
        return { success: true }
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update status"
      toast.error(message)
      return { success: false, message }
    }
  },

  // Get order details
  getOrderDetails: async (orderId) => {
    try {
      const response = await dispatchApi.getOrderDetails(orderId)
      if (response.status === "success") {
        set({ currentOrder: response.data })
        return { success: true, data: response.data }
      }
    } catch (error) {
      console.error("Error fetching order details:", error)
      return { success: false }
    }
  },

  // Enhanced batching logic
  batchOrders: async (orders) => {
    // Use the optimized batching algorithm
    const batches = calculateOptimalBatches(orders)

    // Detect same address orders
    const sameAddressGroups = detectSimilarAddresses(orders)

    // Enhance batches with same address detection
    return batches.map((batch) => ({
      ...batch,
      id: `BATCH_${Date.now()}_${batch.neighborhood.replace(/\s+/g, "")}`,
      sameAddressOrders: sameAddressGroups,
      createdAt: new Date().toISOString(),
    }))
  },

  // Handle same address detection
  detectSameAddress: (orders) => {
    const addressGroups = {}

    orders.forEach((order) => {
      const addressKey = `${order.latitude}_${order.longitude}`
      if (!addressGroups[addressKey]) {
        addressGroups[addressKey] = []
      }
      addressGroups[addressKey].push(order)
    })

    return addressGroups
  },

  // Shift handover management
  handleShiftHandover: async (outgoingRiderId, incomingRiderId) => {
    try {
      const pendingDeliveries = get().assignments.filter(
        (delivery) => delivery.riderId === outgoingRiderId && ["assigned", "in_progress"].includes(delivery.status),
      )

      // Transfer deliveries to incoming rider
      const transferPromises = pendingDeliveries.map((delivery) =>
        dispatchApi.transferDelivery(delivery.id, incomingRiderId),
      )

      await Promise.all(transferPromises)

      // Notify customers about rider change
      pendingDeliveries.forEach((delivery) => {
        // Dummy notification service
        const sendRiderChangeNotification = (customerId, incomingRiderId) => {
          console.log(`Sending rider change notification to customer ${customerId} about rider ${incomingRiderId}`)
        }
        sendRiderChangeNotification(delivery.customerId, incomingRiderId)
      })

      get().fetchAssignments()
      return { success: true }
    } catch (error) {
      console.error("Shift handover failed:", error)
      return { success: false, error: error.message }
    }
  },

  // Customer availability check
  checkCustomerAvailability: async (orderId) => {
    try {
      // Dummy notification service
      const sendPreDeliveryNotification = async (orderId) => {
        console.log(`Sending pre-delivery notification for order ${orderId}`)
      }
      // Send pre-delivery notification
      await sendPreDeliveryNotification(orderId)

      // Wait for customer confirmation
      const confirmationTimeout = setTimeout(() => {
        // Mark as needs rescheduling if no response
        get().markForRescheduling(orderId)
      }, 600000) // 10 minutes

      return { success: true, confirmationTimeout }
    } catch (error) {
      console.error("Customer availability check failed:", error)
      return { success: false, error: error.message }
    }
  },

  // Mark order for rescheduling
  markForRescheduling: (orderId) => {
    set((state) => ({
      assignments: state.assignments.map((order) =>
        order.id === orderId ? { ...order, status: "needs_rescheduling" } : order,
      ),
    }))
    toast.error("Customer did not respond. Order marked for rescheduling.")
  },
}))

export default useDispatchStore
