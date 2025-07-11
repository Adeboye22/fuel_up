"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Package, Users, Route } from "lucide-react"
import useDispatchStore from "@/stores/useDispatchStore"

const BatchManager = () => {
  const { assignments, batchOrders, loading } = useDispatchStore()
  const [batches, setBatches] = useState([])
  const [pendingOrders, setPendingOrders] = useState([])

  useEffect(() => {
    // Filter pending orders that need batching
    const pending = assignments.filter((order) => order.status === "pending" && !order.batchId)
    setPendingOrders(pending)

    // Auto-batch orders every 5 minutes or when 3+ orders pending
    if (pending.length >= 3) {
      handleAutoBatch(pending)
    }
  }, [assignments])

  const handleAutoBatch = async (orders) => {
    const newBatches = await batchOrders(orders)
    setBatches((prev) => [...prev, ...newBatches])
  }

  const getNeighborhoodColor = (neighborhood) => {
    const colors = {
      "Lekki Phase 1": "bg-blue-100 text-blue-800",
      "Lekki Phase 2": "bg-green-100 text-green-800",
      Chevron: "bg-purple-100 text-purple-800",
      VGC: "bg-orange-100 text-orange-800",
      Sangotedo: "bg-pink-100 text-pink-800",
      "Abraham Adesanya": "bg-indigo-100 text-indigo-800",
      Ajah: "bg-yellow-100 text-yellow-800",
      Ikota: "bg-red-100 text-red-800",
      "Osapa London": "bg-teal-100 text-teal-800",
      Jakande: "bg-cyan-100 text-cyan-800",
      "Orchid Road": "bg-lime-100 text-lime-800",
    }
    return colors[neighborhood] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Batch Management</h2>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
            {pendingOrders.length} Pending Orders
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {batches.length} Active Batches
          </Badge>
        </div>
      </div>

      {/* Pending Orders */}
      {pendingOrders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              Pending Orders ({pendingOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingOrders.map((order) => (
                <motion.div
                  key={order.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-900/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">#{order.order_number}</span>
                    <Badge className={getNeighborhoodColor(order.neighborhood)}>{order.neighborhood}</Badge>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-1">
                      <Package className="h-3 w-3" />
                      {order.quantity}L {order.fuel_type}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {order.delivery_address.substring(0, 30)}...
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(order.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            {pendingOrders.length >= 3 && (
              <div className="mt-4 text-center">
                <Button onClick={() => handleAutoBatch(pendingOrders)} className="bg-emerald-600 hover:bg-emerald-500">
                  Create Batches Automatically
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Active Batches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {batches.map((batch) => (
          <BatchCard key={batch.id} batch={batch} />
        ))}
      </div>
    </div>
  )
}

const BatchCard = ({ batch }) => {
  const totalOrders = batch.orders.length
  const totalCapacity = batch.totalCapacity
  const neighborhood = batch.neighborhood

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{batch.id}</h3>
          <Badge className="bg-emerald-100 text-emerald-800">Ready for Dispatch</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">{totalOrders} Orders</span>
          </div>
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-green-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">{totalCapacity}L Total</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-purple-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">{neighborhood}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-orange-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">~{batch.estimatedTime} mins</span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Orders in Batch:</h4>
          {batch.orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <span className="text-sm">#{order.order_number}</span>
              <span className="text-sm font-medium">{order.quantity}L</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button className="flex-1 bg-emerald-600 hover:bg-emerald-500">
            <Route className="h-4 w-4 mr-2" />
            Assign to Rider
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent">
            Modify Batch
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default BatchManager
