/**
 * Calculate estimated delivery time based on batch orders
 * @param {Array} orders - Array of orders in the batch
 * @returns {number} - Estimated time in minutes
 */
export const calculateEstimatedTime = (orders) => {
  if (!orders || orders.length === 0) return 0

  // Base time calculations
  const BASE_TRAVEL_TIME = 15 // Base travel time to first location
  const TIME_PER_DELIVERY = 8 // Average time per delivery (including OTP, handover)
  const TRAVEL_TIME_BETWEEN_STOPS = 5 // Average travel time between nearby locations
  const TRAFFIC_BUFFER = 1.2 // 20% buffer for traffic

  // Calculate total time
  const deliveryTime = orders.length * TIME_PER_DELIVERY
  const travelTime = BASE_TRAVEL_TIME + (orders.length - 1) * TRAVEL_TIME_BETWEEN_STOPS

  // Add complexity factors
  let complexityMultiplier = 1

  // Same neighborhood bonus (faster delivery)
  const neighborhoods = [...new Set(orders.map((order) => order.neighborhood))]
  if (neighborhoods.length === 1) {
    complexityMultiplier = 0.8 // 20% faster for same neighborhood
  }

  // Multiple fuel types complexity
  const fuelTypes = [...new Set(orders.map((order) => order.fuel_type))]
  if (fuelTypes.length > 1) {
    complexityMultiplier += 0.1 // 10% longer for mixed fuel types
  }

  // Large order complexity (30L+ orders take longer)
  const hasLargeOrders = orders.some((order) => order.quantity >= 30)
  if (hasLargeOrders) {
    complexityMultiplier += 0.15 // 15% longer for large orders
  }

  const totalTime = (deliveryTime + travelTime) * complexityMultiplier * TRAFFIC_BUFFER

  return Math.round(totalTime)
}

/**
 * Calculate estimated time for a single delivery
 * @param {Object} order - Single order object
 * @param {number} distanceKm - Distance to delivery location in km
 * @returns {number} - Estimated time in minutes
 */
export const calculateSingleDeliveryTime = (order, distanceKm = 5) => {
  const SPEED_KMH = 25 // Average speed in Lagos traffic
  const DELIVERY_TIME = 8 // Time for actual delivery
  const BUFFER = 1.3 // 30% buffer

  const travelTime = (distanceKm / SPEED_KMH) * 60 // Convert to minutes
  const totalTime = (travelTime + DELIVERY_TIME) * BUFFER

  return Math.round(totalTime)
}

/**
 * Get time-based delivery priority
 * @param {string} orderTime - ISO string of order creation time
 * @returns {string} - Priority level: 'urgent', 'high', 'normal'
 */
export const getDeliveryPriority = (orderTime) => {
  const now = new Date()
  const orderDate = new Date(orderTime)
  const hoursDiff = (now - orderDate) / (1000 * 60 * 60)

  if (hoursDiff > 2) return "urgent"
  if (hoursDiff > 1) return "high"
  return "normal"
}

/**
 * Calculate optimal batch size based on orders and constraints
 * @param {Array} orders - Available orders
 * @param {number} maxCapacity - Maximum capacity (default 40L)
 * @returns {Array} - Array of optimized batches
 */
export const calculateOptimalBatches = (orders, maxCapacity = 40) => {
  const batches = []
  const sortedOrders = [...orders].sort((a, b) => {
    // Sort by neighborhood first, then by order time
    if (a.neighborhood !== b.neighborhood) {
      return a.neighborhood.localeCompare(b.neighborhood)
    }
    return new Date(a.created_at) - new Date(b.created_at)
  })

  let currentBatch = []
  let currentCapacity = 0
  let currentNeighborhood = null

  sortedOrders.forEach((order) => {
    const canAddToCurrentBatch =
      currentCapacity + order.quantity <= maxCapacity &&
      (currentNeighborhood === null || currentNeighborhood === order.neighborhood)

    if (canAddToCurrentBatch) {
      currentBatch.push(order)
      currentCapacity += order.quantity
      currentNeighborhood = order.neighborhood
    } else {
      // Finalize current batch
      if (currentBatch.length > 0) {
        batches.push({
          orders: currentBatch,
          totalCapacity: currentCapacity,
          neighborhood: currentNeighborhood,
          estimatedTime: calculateEstimatedTime(currentBatch),
        })
      }

      // Start new batch
      currentBatch = [order]
      currentCapacity = order.quantity
      currentNeighborhood = order.neighborhood
    }
  })

  // Add final batch
  if (currentBatch.length > 0) {
    batches.push({
      orders: currentBatch,
      totalCapacity: currentCapacity,
      neighborhood: currentNeighborhood,
      estimatedTime: calculateEstimatedTime(currentBatch),
    })
  }

  return batches
}
