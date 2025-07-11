"use client"

import { useEffect, useState } from "react"
import { CheckCircle } from "lucide-react"
import DeliveryCard from "@/components/dashboard/DeliveryCard"
import LoadingSpinner from "@/components/LoadingSpinner"
import useDispatchStore from "@/stores/useDispatchStore"
import { Button } from "@/components/ui/button"

const Deliveries = () => {
  const { completedDeliveries, loading, fetchCompletedDeliveries } = useDispatchStore()

  const [filter, setFilter] = useState("all")

  useEffect(() => {
    fetchCompletedDeliveries()
  }, [fetchCompletedDeliveries])

  const filteredDeliveries = completedDeliveries.filter((delivery) => {
    if (filter === "today") {
      const today = new Date().toDateString()
      return new Date(delivery.completed_at).toDateString() === today
    }
    if (filter === "week") {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return new Date(delivery.completed_at) >= weekAgo
    }
    return true
  })

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Completed Deliveries</h1>
        <div className="flex gap-2">
          <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")} size="sm">
            All
          </Button>
          <Button variant={filter === "today" ? "default" : "outline"} onClick={() => setFilter("today")} size="sm">
            Today
          </Button>
          <Button variant={filter === "week" ? "default" : "outline"} onClick={() => setFilter("week")} size="sm">
            This Week
          </Button>
        </div>
      </div>

      {filteredDeliveries.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No completed deliveries</h3>
          <p className="mt-1 text-sm text-gray-500">Completed deliveries will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDeliveries.map((delivery) => (
            <DeliveryCard key={delivery.id} delivery={delivery} type="completed" />
          ))}
        </div>
      )}
    </div>
  )
}

export default Deliveries
