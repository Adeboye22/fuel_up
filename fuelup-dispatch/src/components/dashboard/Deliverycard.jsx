"use client"

import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Package, Phone } from "lucide-react"
import { formatDate } from "@/utils/formatDate"
import useDispatchStore from "@/stores/useDispatchStore"

const DeliveryCard = ({ delivery, type = "assigned" }) => {
  const { acceptDelivery, startDelivery } = useDispatchStore()

  const handleAccept = async () => {
    await acceptDelivery(delivery.id)
  }

  const handleStart = async () => {
    await startDelivery(delivery.id)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "assigned":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "in_progress":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400"
      case "delivered":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
      <Card className="w-full bg-white/90 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200 dark:border-gray-700/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-gray-900 dark:text-white">Order #{delivery.order_number}</CardTitle>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
              {delivery.status?.replace("_", " ").toUpperCase()}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-emerald-500" />
              <span className="text-gray-600 dark:text-gray-300">
                {delivery.fuel_type} - {delivery.quantity}L
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-500" />
              <span className="text-gray-600 dark:text-gray-300">{formatDate(delivery.created_at)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-emerald-500 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-gray-900 dark:text-white">Delivery Address:</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{delivery.delivery_address}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-emerald-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">{delivery.customer_phone}</span>
          </div>

          {type === "assigned" && (
            <div className="flex gap-2 pt-2">
              {delivery.status === "assigned" && (
                <Button onClick={handleAccept} className="flex-1 bg-emerald-600 hover:bg-emerald-500">
                  Accept Delivery
                </Button>
              )}
              {delivery.status === "accepted" && (
                <Button onClick={handleStart} className="flex-1 bg-emerald-600 hover:bg-emerald-500">
                  Start Delivery
                </Button>
              )}
              {delivery.status === "in_progress" && (
                <Button asChild className="flex-1 bg-emerald-600 hover:bg-emerald-500">
                  <Link to={`/dispatch/confirm/${delivery.id}`}>Complete Delivery</Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default DeliveryCard
