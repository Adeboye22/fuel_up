"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Phone, Navigation, CheckCircle } from "lucide-react"
import useDispatchStore from "@/stores/useDispatchStore"

const DeliveryTracker = () => {
  const { assignments, checkCustomerAvailability } = useDispatchStore()
  const [activeDeliveries, setActiveDeliveries] = useState([])

  useEffect(() => {
    const active = assignments.filter((delivery) => ["assigned", "in_progress"].includes(delivery.status))
    setActiveDeliveries(active)
  }, [assignments])

  const handlePreDeliveryCheck = async (orderId) => {
    await checkCustomerAvailability(orderId)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "assigned":
        return "bg-blue-100 text-blue-800"
      case "in_progress":
        return "bg-emerald-100 text-emerald-800"
      case "customer_unavailable":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Active Deliveries</h2>
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700">
          {activeDeliveries.length} In Progress
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activeDeliveries.map((delivery) => (
          <DeliveryCard
            key={delivery.id}
            delivery={delivery}
            onPreDeliveryCheck={handlePreDeliveryCheck}
            getStatusColor={getStatusColor}
          />
        ))}
      </div>

      {activeDeliveries.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <CheckCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Active Deliveries</h3>
            <p className="text-gray-500 dark:text-gray-400">All deliveries are completed or pending assignment</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

const DeliveryCard = ({ delivery, onPreDeliveryCheck, getStatusColor }) => {
  const [customerStatus, setCustomerStatus] = useState("unknown")

  const handleCustomerCheck = async () => {
    setCustomerStatus("checking")
    await onPreDeliveryCheck(delivery.id)
    setCustomerStatus("notified")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Order #{delivery.order_number}</h3>
          <Badge className={getStatusColor(delivery.status)}>{delivery.status.replace("_", " ").toUpperCase()}</Badge>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-purple-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">{delivery.delivery_address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-green-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">{delivery.customer_phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-orange-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Ordered: {new Date(delivery.created_at).toLocaleString()}
            </span>
          </div>
        </div>

        {delivery.batchId && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2">
              <Navigation className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Batch: {delivery.batchId}</span>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Part of multi-delivery route</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleCustomerCheck}
            disabled={customerStatus === "checking"}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500"
          >
            {customerStatus === "checking" ? "Notifying..." : "Check Customer"}
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent">
            <Phone className="h-4 w-4 mr-2" />
            Call Customer
          </Button>
        </div>

        {customerStatus === "notified" && (
          <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded text-center">
            <span className="text-sm text-green-700 dark:text-green-300">
              ✅ Customer notified - Awaiting confirmation
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default DeliveryTracker
