/**
 * Address validation utilities for FuelUp delivery system
 */

// Supported delivery neighborhoods
export const SUPPORTED_NEIGHBORHOODS = [
  "Sangotedo",
  "Abraham Adesanya",
  "Ajah",
  "VGC",
  "Ikota",
  "Chevron",
  "Osapa London",
  "Jakande",
  "Orchid Road",
  "Lekki Phase 1",
  "Lekki Phase 2",
]

// LGA mapping
export const LGA_MAPPING = {
  "Eti-Osa": ["Lekki Phase 1", "Lekki Phase 2", "VGC", "Chevron", "Osapa London", "Jakande", "Orchid Road"],
  "Ibeju-Lekki": ["Sangotedo", "Abraham Adesanya", "Ajah", "Ikota"],
}

/**
 * Validate if address is within service area
 * @param {string} neighborhood - Neighborhood name
 * @param {string} lga - Local Government Area
 * @returns {Object} - Validation result
 */
export const validateServiceArea = (neighborhood, lga) => {
  const isNeighborhoodSupported = SUPPORTED_NEIGHBORHOODS.includes(neighborhood)
  const isLGAValid = Object.keys(LGA_MAPPING).includes(lga)
  const isNeighborhoodInLGA = LGA_MAPPING[lga]?.includes(neighborhood)

  return {
    isValid: isNeighborhoodSupported && isLGAValid && isNeighborhoodInLGA,
    neighborhood: isNeighborhoodSupported,
    lga: isLGAValid,
    mapping: isNeighborhoodInLGA,
    supportedAreas: SUPPORTED_NEIGHBORHOODS,
  }
}

/**
 * Get neighboring areas for batch optimization
 * @param {string} neighborhood - Primary neighborhood
 * @returns {Array} - Array of nearby neighborhoods
 */
export const getNearbyNeighborhoods = (neighborhood) => {
  const neighborhoodGroups = {
    "Lekki Phase 1": ["Lekki Phase 2", "VGC", "Chevron"],
    "Lekki Phase 2": ["Lekki Phase 1", "VGC", "Orchid Road"],
    VGC: ["Lekki Phase 1", "Lekki Phase 2", "Chevron"],
    Chevron: ["Lekki Phase 1", "VGC", "Osapa London"],
    "Osapa London": ["Chevron", "Jakande", "Orchid Road"],
    Jakande: ["Osapa London", "Orchid Road"],
    "Orchid Road": ["Lekki Phase 2", "Osapa London", "Jakande"],
    Sangotedo: ["Abraham Adesanya", "Ajah"],
    "Abraham Adesanya": ["Sangotedo", "Ajah", "Ikota"],
    Ajah: ["Sangotedo", "Abraham Adesanya", "Ikota"],
    Ikota: ["Abraham Adesanya", "Ajah"],
  }

  return neighborhoodGroups[neighborhood] || []
}

/**
 * Calculate delivery priority based on location
 * @param {string} neighborhood - Neighborhood name
 * @returns {number} - Priority score (1-5, higher is more priority)
 */
export const getLocationPriority = (neighborhood) => {
  const priorityMap = {
    "Lekki Phase 1": 5, // High priority - central location
    "Lekki Phase 2": 5,
    VGC: 4,
    Chevron: 4,
    "Osapa London": 3,
    "Orchid Road": 3,
    Jakande: 3,
    Sangotedo: 2,
    "Abraham Adesanya": 2,
    Ajah: 2,
    Ikota: 1, // Lower priority - furthest location
  }

  return priorityMap[neighborhood] || 1
}

/**
 * Detect potential duplicate addresses
 * @param {Array} orders - Array of orders
 * @returns {Object} - Grouped orders by similar addresses
 */
export const detectSimilarAddresses = (orders) => {
  const addressGroups = {}

  orders.forEach((order) => {
    // Create a simplified address key for comparison
    const addressKey = `${order.neighborhood}_${order.street || ""}_${order.houseNumber || ""}`
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "")

    if (!addressGroups[addressKey]) {
      addressGroups[addressKey] = []
    }
    addressGroups[addressKey].push(order)
  })

  // Return only groups with multiple orders
  return Object.fromEntries(Object.entries(addressGroups).filter(([key, orders]) => orders.length > 1))
}

/**
 * Format address for display
 * @param {Object} address - Address object
 * @returns {string} - Formatted address string
 */
export const formatAddress = (address) => {
  const parts = [address.houseNumber, address.street, address.landmark, address.neighborhood, address.lga].filter(
    Boolean,
  )

  return parts.join(", ")
}
