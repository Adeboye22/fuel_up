// Business logic utilities for delivery management

export const FUEL_QUANTITIES = [10, 20, 30, 40] // Only allowed quantities (multiples of 10L kegs)
export const MAX_BOX_CAPACITY = 40 // Maximum liters per rider box (4 kegs × 10L each)
export const KEGS_PER_BOX = 4 // Number of 10L kegs that fit in the box
export const KEG_SIZE = 10 // Each keg is 10 liters
export const ORDER_GROUPING_TIME_WINDOW = 15 // Minutes to group orders
export const MAX_DELIVERY_RADIUS = 2 // km for nearby location grouping

// Calculate remaining capacity for a rider (in terms of kegs and liters)
export const calculateRemainingCapacity = (activeDeliveries = []) => {
  const totalAssigned = activeDeliveries
    .filter((delivery) => ["assigned", "accepted", "in_progress"].includes(delivery.status))
    .reduce((total, delivery) => total + (delivery.quantity || 0), 0)

  const remainingLiters = Math.max(0, MAX_BOX_CAPACITY - totalAssigned)
  const remainingKegs = Math.floor(remainingLiters / KEG_SIZE)

  return {
    liters: remainingLiters,
    kegs: remainingKegs,
    usedLiters: totalAssigned,
    usedKegs: Math.ceil(totalAssigned / KEG_SIZE),
    totalKegs: KEGS_PER_BOX,
  }
}

// Check if an order can be assigned to a rider
export const canAssignOrder = (orderQuantity, activeDeliveries = []) => {
  const capacity = calculateRemainingCapacity(activeDeliveries)
  return orderQuantity <= capacity.liters && isValidFuelQuantity(orderQuantity)
}

// Normalize address for grouping logic
export const normalizeAddress = (address) => {
  if (!address) return ""

  return address
    .toLowerCase()
    .replace(/\b(house|hse|no\.?|number)\s*/gi, "")
    .replace(/\s+/g, " ")
    .trim()
}

// Check if two addresses are similar for grouping
export const areAddressesSimilar = (address1, address2) => {
  const normalized1 = normalizeAddress(address1)
  const normalized2 = normalizeAddress(address2)

  // Extract street name (assuming format: "7 freedom way, lekki")
  const getStreetName = (addr) => {
    const parts = addr.split(",")
    return parts[0]?.replace(/^\d+\s*/, "").trim() || addr
  }

  const street1 = getStreetName(normalized1)
  const street2 = getStreetName(normalized2)

  // Check if street names match (allowing for minor variations)
  return street1 === street2 || street1.includes(street2) || street2.includes(street1)
}

// Group orders by location and time
export const groupOrdersByLocation = (orders) => {
  const groups = []
  const processed = new Set()

  orders.forEach((order, index) => {
    if (processed.has(index)) return

    const group = [order]
    processed.add(index)

    // Find similar orders within time window
    orders.forEach((otherOrder, otherIndex) => {
      if (processed.has(otherIndex) || index === otherIndex) return

      const timeDiff = Math.abs(new Date(order.created_at) - new Date(otherOrder.created_at)) / (1000 * 60) // minutes

      const sameLocation = areAddressesSimilar(order.delivery_address, otherOrder.delivery_address)

      if (sameLocation && timeDiff <= ORDER_GROUPING_TIME_WINDOW) {
        group.push(otherOrder)
        processed.add(otherIndex)
      }
    })

    groups.push(group)
  })

  return groups
}

// Calculate total quantity for grouped orders
export const calculateGroupQuantity = (orderGroup) => {
  return orderGroup.reduce((total, order) => total + (order.quantity || 0), 0)
}

// Check if rider can handle grouped orders
export const canHandleGroupedOrders = (orderGroup, activeDeliveries = []) => {
  const groupQuantity = calculateGroupQuantity(orderGroup)
  return canAssignOrder(groupQuantity, activeDeliveries)
}

// Validate fuel quantity selection (must be multiples of 10L)
export const isValidFuelQuantity = (quantity) => {
  return FUEL_QUANTITIES.includes(Number(quantity)) && Number(quantity) % KEG_SIZE === 0
}

// Check for duplicate orders (spam prevention)
export const isDuplicateOrder = (newOrder, recentOrders, timeWindowMinutes = 5) => {
  const cutoffTime = new Date(Date.now() - timeWindowMinutes * 60 * 1000)

  return recentOrders.some(
    (order) =>
      order.customer_phone === newOrder.customer_phone &&
      order.delivery_address === newOrder.delivery_address &&
      new Date(order.created_at) > cutoffTime,
  )
}

// Get assignable orders for a rider based on capacity
export const getAssignableOrders = (availableOrders, activeDeliveries) => {
  const remainingCapacity = calculateRemainingCapacity(activeDeliveries)

  return availableOrders.filter(
    (order) => order.quantity <= remainingCapacity.liters && isValidFuelQuantity(order.quantity),
  )
}

// Check if rider has pending deliveries
export const hasPendingDeliveries = (activeDeliveries) => {
  return activeDeliveries.some((delivery) => ["assigned", "accepted", "in_progress"].includes(delivery.status))
}

// Get delivery status flow
export const getNextDeliveryAction = (delivery) => {
  switch (delivery.status) {
    case "assigned":
      return { action: "accept", label: "Accept Delivery", color: "emerald" }
    case "accepted":
      return { action: "start", label: "Start Delivery", color: "blue" }
    case "in_progress":
      return { action: "complete", label: "Complete Delivery", color: "green" }
    default:
      return null
  }
}

// Get keg count for a given quantity
export const getKegCount = (quantity) => {
  return Math.ceil(Number(quantity) / KEG_SIZE)
}

// Check if rider box has enough kegs for an order
export const hasEnoughKegs = (orderQuantity, activeDeliveries = []) => {
  const capacity = calculateRemainingCapacity(activeDeliveries)
  const requiredKegs = getKegCount(orderQuantity)
  return requiredKegs <= capacity.kegs
}
