// Mock API service that simulates real API responses with realistic data
import { DELIVERY_STATUS, ORDER_TYPES } from "@/utils/constants"
import { createDeliveryBatches, extractNeighborhood } from "@/utils/deliveryLogic"

// Simulate network delay
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock data storage - SINGLE DISPATCH RIDER SYSTEM with Smart Batching
const mockData = {
  // THE dispatch rider (only one in the system)
  rider: {
    id: "dispatch_rider_001",
    name: "John Doe",
    email: "dispatch@fuelup.com",
    phone: "+234 801 234 5678",
    address: "FuelUp Dispatch Center, Victoria Island, Lagos",
    status: "offline",
    role: "dispatch_rider",
    title: "FuelUp Dispatch Rider",
    boxCapacity: {
      total: 40,
      totalKegs: 4,
      used: 0,
      usedKegs: 0,
      remaining: 40,
      remainingKegs: 4,
    },
  },

  // Smart batching scenarios - All fuel delivery orders in the system
  assignments: [
    // Scenario A: Same Neighborhood (Chevron), Full Load - 40L Total
    {
      id: "order_001",
      order_number: "FU2024001",
      customer_name: "Alice Johnson",
      customer_phone: "+234 802 345 6789",
      delivery_address: "12 Chevron Drive, Chevron Estate, Lekki, Lagos",
      fuel_type: ORDER_TYPES.PETROL,
      quantity: 20,
      status: DELIVERY_STATUS.PENDING,
      created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 mins ago
      estimated_delivery: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
      priority: "normal",
      special_instructions: "Call when you arrive at the gate",
      batchable: true,
      neighborhood: "Chevron",
    },
    {
      id: "order_002",
      order_number: "FU2024002",
      customer_name: "Bob Smith",
      customer_phone: "+234 803 456 7890",
      delivery_address: "8 Chevron Close, Chevron Estate, Lekki, Lagos",
      fuel_type: ORDER_TYPES.PETROL,
      quantity: 10,
      status: DELIVERY_STATUS.PENDING,
      created_at: new Date(Date.now() - 8 * 60 * 1000).toISOString(), // 8 mins ago
      estimated_delivery: new Date(Date.now() + 1.5 * 60 * 60 * 1000).toISOString(),
      priority: "normal",
      special_instructions: "Apartment 4B, use the service elevator",
      batchable: true,
      neighborhood: "Chevron",
    },
    {
      id: "order_003",
      order_number: "FU2024003",
      customer_name: "Carol Williams",
      customer_phone: "+234 804 567 8901",
      delivery_address: "25 Chevron Avenue, Chevron Estate, Lekki, Lagos",
      fuel_type: ORDER_TYPES.PETROL,
      quantity: 10,
      status: DELIVERY_STATUS.PENDING,
      created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 mins ago
      estimated_delivery: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      priority: "normal",
      special_instructions: "Office building, ask for Carol at reception",
      batchable: true,
      neighborhood: "Chevron",
    },

    // Scenario B: Different Neighborhoods - Load Split Required
    {
      id: "order_004",
      order_number: "FU2024004",
      customer_name: "David Brown",
      customer_phone: "+234 805 678 9012",
      delivery_address: "14 Sangotedo Road, Sangotedo, Ajah, Lagos",
      fuel_type: ORDER_TYPES.DIESEL,
      quantity: 20,
      status: DELIVERY_STATUS.PENDING,
      created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 mins ago
      estimated_delivery: new Date(Date.now() + 2.5 * 60 * 60 * 1000).toISOString(),
      priority: "high",
      special_instructions: "House with blue gate",
      batchable: true,
      neighborhood: "Sangotedo",
    },
    {
      id: "order_005",
      order_number: "FU2024005",
      customer_name: "Eve Davis",
      customer_phone: "+234 806 789 0123",
      delivery_address: "45 Ajah Market Road, Ajah, Lagos",
      fuel_type: ORDER_TYPES.PETROL,
      quantity: 20,
      status: DELIVERY_STATUS.PENDING,
      created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(), // 12 mins ago
      estimated_delivery: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
      priority: "normal",
      special_instructions: "Near the market entrance",
      batchable: true,
      neighborhood: "Ajah",
    },
    {
      id: "order_006",
      order_number: "FU2024006",
      customer_name: "Frank Wilson",
      customer_phone: "+234 807 890 1234",
      delivery_address: "33 Lekki Phase 2 Estate, Lekki, Lagos",
      fuel_type: ORDER_TYPES.KEROSENE,
      quantity: 10,
      status: DELIVERY_STATUS.PENDING,
      created_at: new Date(Date.now() - 3 * 60 * 1000).toISOString(), // 3 mins ago
      estimated_delivery: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      priority: "normal",
      special_instructions: "Queued for next trip - outside current route",
      batchable: false, // Will be queued
      neighborhood: "Lekki Phase 2",
    },

    // Scenario C: Mixed Neighborhoods with Capacity Overflow
    {
      id: "order_007",
      order_number: "FU2024007",
      customer_name: "Grace Taylor",
      customer_phone: "+234 808 901 2345",
      delivery_address: "18 Abraham Adesanya Estate, Abraham Adesanya, Ajah, Lagos",
      fuel_type: ORDER_TYPES.PETROL,
      quantity: 10,
      status: DELIVERY_STATUS.PENDING,
      created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(), // 20 mins ago
      estimated_delivery: new Date(Date.now() + 1.5 * 60 * 60 * 1000).toISOString(),
      priority: "normal",
      special_instructions: "Group 1 candidate",
      batchable: true,
      neighborhood: "Abraham Adesanya",
    },
    {
      id: "order_008",
      order_number: "FU2024008",
      customer_name: "Henry Anderson",
      customer_phone: "+234 809 012 3456",
      delivery_address: "7 Ikota Shopping Complex, Ikota, Lekki, Lagos",
      fuel_type: ORDER_TYPES.DIESEL,
      quantity: 10,
      status: DELIVERY_STATUS.PENDING,
      created_at: new Date(Date.now() - 18 * 60 * 1000).toISOString(), // 18 mins ago
      estimated_delivery: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      priority: "normal",
      special_instructions: "Group 1 candidate",
      batchable: true,
      neighborhood: "Ikota",
    },
    {
      id: "order_009",
      order_number: "FU2024009",
      customer_name: "Ivy Johnson",
      customer_phone: "+234 810 123 4567",
      delivery_address: "22 Abraham Adesanya Close, Abraham Adesanya, Ajah, Lagos",
      fuel_type: ORDER_TYPES.PETROL,
      quantity: 10,
      status: DELIVERY_STATUS.PENDING,
      created_at: new Date(Date.now() - 16 * 60 * 1000).toISOString(), // 16 mins ago
      estimated_delivery: new Date(Date.now() + 2.5 * 60 * 60 * 1000).toISOString(),
      priority: "normal",
      special_instructions: "Group 1 candidate - same area as Grace",
      batchable: true,
      neighborhood: "Abraham Adesanya",
    },

    // Scenario D: Same Street, Same Timeframe
    {
      id: "order_010",
      order_number: "FU2024010",
      customer_name: "Jack Brown",
      customer_phone: "+234 811 234 5678",
      delivery_address: "12 Orchid Road, Harmony Street, Lekki Phase 1, Lagos",
      fuel_type: ORDER_TYPES.PETROL,
      quantity: 20,
      status: DELIVERY_STATUS.PENDING,
      created_at: new Date(Date.now() - 7 * 60 * 1000).toISOString(), // 7 mins ago
      estimated_delivery: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
      priority: "high",
      special_instructions: "Same street batch - priority customer",
      batchable: true,
      neighborhood: "Lekki Phase 1",
    },
    {
      id: "order_011",
      order_number: "FU2024011",
      customer_name: "Kate Wilson",
      customer_phone: "+234 812 345 6789",
      delivery_address: "18 Orchid Road, Harmony Street, Lekki Phase 1, Lagos",
      fuel_type: ORDER_TYPES.DIESEL,
      quantity: 10,
      status: DELIVERY_STATUS.PENDING,
      created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 mins ago
      estimated_delivery: new Date(Date.now() + 1.2 * 60 * 60 * 1000).toISOString(),
      priority: "normal",
      special_instructions: "Same street as Jack",
      batchable: true,
      neighborhood: "Lekki Phase 1",
    },
    {
      id: "order_012",
      order_number: "FU2024012",
      customer_name: "Leo Davis",
      customer_phone: "+234 813 456 7890",
      delivery_address: "5 Orchid Road, Bliss Close, Lekki Phase 1, Lagos",
      fuel_type: ORDER_TYPES.PETROL,
      quantity: 10,
      status: DELIVERY_STATUS.PENDING,
      created_at: new Date(Date.now() - 3 * 60 * 1000).toISOString(), // 3 mins ago
      estimated_delivery: new Date(Date.now() + 1.5 * 60 * 60 * 1000).toISOString(),
      priority: "normal",
      special_instructions: "Close to Harmony Street - can batch",
      batchable: true,
      neighborhood: "Lekki Phase 1",
    },
  ],

  // Completed deliveries with batch information
  completedDeliveries: [
    {
      id: "batch_completed_001",
      batch_id: "batch_001",
      order_numbers: ["FU2024101", "FU2024102"],
      total_quantity: 30,
      neighborhood: "Victoria Island",
      status: DELIVERY_STATUS.DELIVERED,
      completed_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      delivery_time: "45 minutes",
      stops_completed: 2,
      route_efficiency: "95%",
    },
  ],

  // Authentication token for THE dispatch rider
  authToken: "dispatch_rider_token_12345",

  // System settings
  settings: {
    maxBoxCapacity: 40,
    maxKegs: 4,
    kegSize: 10,
    allowedQuantities: [10, 20, 30, 40],
    orderGroupingTimeWindow: 15, // minutes
    maxDeliveryRadius: 2, // km
    batchingEnabled: true,
    autoRouteOptimization: true,
  },
}

// Helper function to calculate current box usage
const calculateBoxUsage = () => {
  const activeDeliveries = mockData.assignments.filter((delivery) =>
    ["assigned", "accepted", "in_progress"].includes(delivery.status),
  )

  const used = activeDeliveries.reduce((total, delivery) => total + delivery.quantity, 0)
  const usedKegs = Math.ceil(used / mockData.settings.kegSize)
  const remaining = Math.max(0, mockData.settings.maxBoxCapacity - used)
  const remainingKegs = Math.max(0, mockData.settings.maxKegs - usedKegs)

  mockData.rider.boxCapacity = {
    total: mockData.settings.maxBoxCapacity,
    totalKegs: mockData.settings.maxKegs,
    used,
    usedKegs,
    remaining,
    remainingKegs,
  }

  return mockData.rider.boxCapacity
}

// Generate smart batches from current orders
const generateSmartBatches = () => {
  const pendingOrders = mockData.assignments.filter((order) => order.status === DELIVERY_STATUS.PENDING)
  return createDeliveryBatches(pendingOrders)
}

// Mock API service with enhanced batching
export const mockApiService = {
  // Authentication
  login: async (credentials) => {
    await delay(1000)

    if (credentials.email === "dispatch@fuelup.com" && credentials.password === "dispatch123") {
      return {
        status: "success",
        data: {
          accessToken: mockData.authToken,
          role: "dispatch_rider",
          user: mockData.rider,
        },
      }
    }

    throw new Error("Invalid credentials - Only the dispatch rider can access this system")
  },

  getProfile: async () => {
    await delay(300)
    return {
      status: "success",
      data: mockData.rider,
    }
  },

  updateProfile: async (profileData) => {
    await delay(500)
    mockData.rider = { ...mockData.rider, ...profileData }
    return {
      status: "success",
      data: mockData.rider,
    }
  },

  logout: async () => {
    await delay(200)
    return { status: "success" }
  },

  // Enhanced dispatch operations with batching
  getAssignments: async () => {
    await delay(400)
    calculateBoxUsage()

    // Add batch information to orders
    const batches = generateSmartBatches()
    const ordersWithBatches = mockData.assignments.map((order) => {
      const batch = batches.find((b) => b.orders.some((o) => o.id === order.id))
      return {
        ...order,
        batchInfo: batch
          ? {
              batchId: batch.id,
              batchSize: batch.orders.length,
              totalQuantity: batch.totalQuantity,
              estimatedDuration: batch.estimatedDuration,
              routeOptimized: true,
            }
          : null,
      }
    })

    return {
      status: "success",
      data: ordersWithBatches,
      meta: {
        totalOrders: mockData.assignments.length,
        availableBatches: batches.length,
        boxCapacity: mockData.rider.boxCapacity,
      },
    }
  },

  // Get smart batches for dispatch planning
  getSmartBatches: async () => {
    await delay(300)
    const batches = generateSmartBatches()

    return {
      status: "success",
      data: batches,
      meta: {
        totalBatches: batches.length,
        totalOrders: batches.reduce((sum, batch) => sum + batch.orders.length, 0),
        recommendedRoute: batches[0], // Highest priority batch
      },
    }
  },

  getCompletedDeliveries: async () => {
    await delay(300)
    return {
      status: "success",
      data: mockData.completedDeliveries,
    }
  },

  // Accept entire batch for delivery
  acceptBatch: async (batchId) => {
    await delay(600)

    const batches = generateSmartBatches()
    const batch = batches.find((b) => b.id === batchId)

    if (!batch) {
      throw new Error("Batch not found")
    }

    // Check capacity
    const currentUsage = calculateBoxUsage()
    const requiredKegs = Math.ceil(batch.totalQuantity / mockData.settings.kegSize)

    if (batch.totalQuantity > currentUsage.remaining || requiredKegs > currentUsage.remainingKegs) {
      throw new Error(
        `Insufficient capacity. Need ${requiredKegs} keg${requiredKegs > 1 ? "s" : ""} (${batch.totalQuantity}L), ` +
          `have ${currentUsage.remainingKegs} keg${currentUsage.remainingKegs !== 1 ? "s" : ""} (${currentUsage.remaining}L) available.`,
      )
    }

    // Update all orders in batch to accepted
    batch.orders.forEach((order) => {
      const orderIndex = mockData.assignments.findIndex((a) => a.id === order.id)
      if (orderIndex !== -1) {
        mockData.assignments[orderIndex].status = DELIVERY_STATUS.ACCEPTED
        mockData.assignments[orderIndex].accepted_at = new Date().toISOString()
        mockData.assignments[orderIndex].batchId = batchId
      }
    })

    calculateBoxUsage()

    return {
      status: "success",
      data: {
        batchId,
        ordersAccepted: batch.orders.length,
        totalQuantity: batch.totalQuantity,
        estimatedDuration: batch.estimatedDuration,
        route: batch.orders.map((o) => ({
          orderId: o.id,
          address: o.delivery_address,
          customer: o.customer_name,
          quantity: o.quantity,
        })),
      },
    }
  },

  acceptDelivery: async (orderId) => {
    await delay(600)

    const order = mockData.assignments.find((a) => a.id === orderId)
    if (!order) {
      throw new Error("Order not found")
    }

    // Check capacity
    const currentUsage = calculateBoxUsage()
    const requiredKegs = Math.ceil(order.quantity / mockData.settings.kegSize)

    if (order.quantity > currentUsage.remaining || requiredKegs > currentUsage.remainingKegs) {
      throw new Error(
        `Insufficient capacity. Need ${requiredKegs} keg${requiredKegs > 1 ? "s" : ""} (${order.quantity}L), ` +
          `have ${currentUsage.remainingKegs} keg${currentUsage.remainingKegs !== 1 ? "s" : ""} (${currentUsage.remaining}L) available.`,
      )
    }

    // Update order status
    order.status = DELIVERY_STATUS.ACCEPTED
    order.accepted_at = new Date().toISOString()

    calculateBoxUsage()

    return {
      status: "success",
      data: order,
    }
  },

  startDelivery: async (orderId) => {
    await delay(500)

    const order = mockData.assignments.find((a) => a.id === orderId)
    if (!order) {
      throw new Error("Order not found")
    }

    if (order.status !== DELIVERY_STATUS.ACCEPTED) {
      throw new Error("Order must be accepted before starting delivery")
    }

    order.status = DELIVERY_STATUS.IN_PROGRESS
    order.started_at = new Date().toISOString()

    return {
      status: "success",
      data: order,
    }
  },

  // Start batch delivery route
  startBatchDelivery: async (batchId) => {
    await delay(500)

    const batchOrders = mockData.assignments.filter((a) => a.batchId === batchId)

    if (batchOrders.length === 0) {
      throw new Error("Batch not found or no orders in batch")
    }

    // Update all orders in batch to in_progress
    batchOrders.forEach((order) => {
      order.status = DELIVERY_STATUS.IN_PROGRESS
      order.started_at = new Date().toISOString()
    })

    return {
      status: "success",
      data: {
        batchId,
        ordersStarted: batchOrders.length,
        route: batchOrders.map((o) => ({
          orderId: o.id,
          address: o.delivery_address,
          customer: o.customer_name,
          quantity: o.quantity,
          status: o.status,
        })),
      },
    }
  },

  confirmDelivery: async (orderId, formData) => {
    await delay(800)

    const order = mockData.assignments.find((a) => a.id === orderId)
    if (!order) {
      throw new Error("Order not found")
    }

    // Simulate OTP validation
    const otp = formData.get ? formData.get("otp") : formData.otp
    if (!otp || otp.length !== 6) {
      throw new Error("Invalid OTP. Please enter a 6-digit code.")
    }

    // Move to completed deliveries
    order.status = DELIVERY_STATUS.DELIVERED
    order.completed_at = new Date().toISOString()
    order.delivery_time = `${Math.floor(Math.random() * 30) + 15} minutes`
    order.rating = Math.floor(Math.random() * 2) + 4 // 4 or 5 stars

    mockData.completedDeliveries.unshift(order)
    mockData.assignments = mockData.assignments.filter((a) => a.id !== orderId)

    calculateBoxUsage()

    return {
      status: "success",
      data: order,
    }
  },

  updateRiderStatus: async (status) => {
    await delay(300)

    if (status === "offline") {
      // Check for pending deliveries
      const pendingDeliveries = mockData.assignments.filter((delivery) =>
        ["accepted", "in_progress"].includes(delivery.status),
      )

      if (pendingDeliveries.length > 0) {
        throw new Error("Cannot go offline while you have pending deliveries")
      }
    }

    mockData.rider.status = status

    return {
      status: "success",
      data: { status },
    }
  },

  refillBox: async () => {
    await delay(700)

    // Check if all deliveries are completed
    const pendingDeliveries = mockData.assignments.filter((delivery) =>
      ["assigned", "accepted", "in_progress"].includes(delivery.status),
    )

    if (pendingDeliveries.length > 0) {
      throw new Error("Complete all pending deliveries before refilling")
    }

    // Reset box capacity
    mockData.rider.boxCapacity = {
      total: mockData.settings.maxBoxCapacity,
      totalKegs: mockData.settings.maxKegs,
      used: 0,
      usedKegs: 0,
      remaining: mockData.settings.maxBoxCapacity,
      remainingKegs: mockData.settings.maxKegs,
    }

    return {
      status: "success",
      data: mockData.rider.boxCapacity,
    }
  },

  getOrderDetails: async (orderId) => {
    await delay(200)

    const order =
      mockData.assignments.find((a) => a.id === orderId) || mockData.completedDeliveries.find((d) => d.id === orderId)

    if (!order) {
      throw new Error("Order not found")
    }

    return {
      status: "success",
      data: order,
    }
  },

  getRiderCapacity: async () => {
    await delay(200)
    const capacity = calculateBoxUsage()
    return {
      status: "success",
      data: capacity,
    }
  },

  // Admin controls for batch management
  createForcedBatch: async (orderIds) => {
    await delay(500)

    const orders = mockData.assignments.filter((a) => orderIds.includes(a.id))
    const totalQuantity = orders.reduce((sum, order) => sum + order.quantity, 0)

    if (totalQuantity > mockData.settings.maxBoxCapacity) {
      throw new Error(`Batch exceeds capacity: ${totalQuantity}L > ${mockData.settings.maxBoxCapacity}L`)
    }

    const batchId = `forced_batch_${Date.now()}`

    // Update orders with forced batch ID
    orders.forEach((order) => {
      order.forcedBatchId = batchId
      order.isForced = true
    })

    return {
      status: "success",
      data: {
        batchId,
        orders: orders.length,
        totalQuantity,
        type: "admin_override",
      },
    }
  },

  // Get real-time order insights for admin
  getOrderInsights: async () => {
    await delay(300)

    const batches = generateSmartBatches()
    const pendingOrders = mockData.assignments.filter((o) => o.status === DELIVERY_STATUS.PENDING)

    return {
      status: "success",
      data: {
        totalPendingOrders: pendingOrders.length,
        availableBatches: batches.length,
        capacityUtilization: `${mockData.rider.boxCapacity.used}L / ${mockData.rider.boxCapacity.total}L`,
        recommendedBatches: batches.slice(0, 3), // Top 3 recommended batches
        neighborhoods: [
          ...new Set(pendingOrders.map((o) => extractNeighborhood(o.delivery_address)?.name).filter(Boolean)),
        ],
        averageOrderValue: pendingOrders.reduce((sum, o) => sum + o.quantity, 0) / pendingOrders.length || 0,
      },
    }
  },
}

// Enhanced scenarios for testing smart batching
export const mockScenarios = {
  // Scenario A: Same Neighborhood Full Load (Chevron - 40L)
  setChevronFullLoad: () => {
    const chevronOrders = mockData.assignments.filter((o) => o.neighborhood === "Chevron")
    chevronOrders.forEach((order) => {
      order.status = DELIVERY_STATUS.PENDING
      order.created_at = new Date(Date.now() - Math.random() * 10 * 60 * 1000).toISOString() // Within 10 mins
    })
    calculateBoxUsage()
  },

  // Scenario B: Different Neighborhoods - Load Split
  setMixedNeighborhoods: () => {
    // Reset all to pending
    mockData.assignments.forEach((order) => {
      order.status = DELIVERY_STATUS.PENDING
    })

    // Accept Sangotedo + Ajah orders (40L total)
    const sangotedoOrder = mockData.assignments.find((o) => o.neighborhood === "Sangotedo")
    const ajahOrder = mockData.assignments.find((o) => o.neighborhood === "Ajah")

    if (sangotedoOrder) sangotedoOrder.status = DELIVERY_STATUS.ACCEPTED
    if (ajahOrder) ajahOrder.status = DELIVERY_STATUS.ACCEPTED

    calculateBoxUsage()
  },

  // Scenario C: Capacity Overflow - Smart Grouping
  setCapacityOverflow: () => {
    // Group Abraham Adesanya + Ikota orders
    const abrahamOrders = mockData.assignments.filter((o) => o.neighborhood === "Abraham Adesanya")
    const ikotaOrder = mockData.assignments.find((o) => o.neighborhood === "Ikota")

    abrahamOrders.forEach((order) => (order.status = DELIVERY_STATUS.ACCEPTED))
    if (ikotaOrder) ikotaOrder.status = DELIVERY_STATUS.ACCEPTED

    calculateBoxUsage()
  },

  // Scenario D: Same Street Optimization
  setSameStreetBatch: () => {
    const orchidRoadOrders = mockData.assignments.filter((o) => o.delivery_address.includes("Orchid Road"))

    orchidRoadOrders.forEach((order) => {
      order.status = DELIVERY_STATUS.ACCEPTED
      order.batchId = "orchid_road_batch"
    })

    calculateBoxUsage()
  },

  // Reset to default state
  reset: () => {
    mockData.rider.status = "offline"
    mockData.assignments.forEach((order) => {
      order.status = DELIVERY_STATUS.PENDING
      delete order.batchId
      delete order.forcedBatchId
      delete order.isForced
    })
    calculateBoxUsage()
  },

  // Simulate near full capacity
  setNearFullCapacity: () => {
    // Accept orders totaling 35L
    const orders = mockData.assignments.slice(0, 3) // First 3 orders
    orders.forEach((order) => {
      order.status = DELIVERY_STATUS.ACCEPTED
    })
    calculateBoxUsage()
  },

  // Simulate full capacity
  setFullCapacity: () => {
    // Accept orders totaling exactly 40L
    const orders = mockData.assignments.filter((o) => o.neighborhood === "Chevron") // 40L total
    orders.forEach((order) => {
      order.status = DELIVERY_STATUS.ACCEPTED
    })
    calculateBoxUsage()
  },
}

export default mockApiService
