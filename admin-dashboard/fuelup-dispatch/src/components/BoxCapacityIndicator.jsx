"use client"

import { motion } from "framer-motion"
import { Fuel, AlertTriangle, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import useDispatchStore from "@/stores/useDispatchStore"

const BoxCapacityIndicator = ({ className = "" }) => {
  const { boxCapacity, refillBox, loading } = useDispatchStore()
  const { total, totalKegs, used, usedKegs, remaining, remainingKegs } = boxCapacity

  const usagePercentage = (used / total) * 100
  const kegUsagePercentage = (usedKegs / totalKegs) * 100
  const isNearFull = usagePercentage >= 80
  const isFull = remaining === 0

  const getStatusColor = () => {
    if (isFull) return "text-red-600 dark:text-red-400"
    if (isNearFull) return "text-amber-600 dark:text-amber-400"
    return "text-emerald-600 dark:text-emerald-400"
  }

  const getStatusIcon = () => {
    if (isFull) return <AlertTriangle className="h-5 w-5 text-red-500" />
    if (isNearFull) return <AlertTriangle className="h-5 w-5 text-amber-500" />
    return <CheckCircle className="h-5 w-5 text-emerald-500" />
  }

  const handleRefill = async () => {
    await refillBox()
  }

  return (
    <Card
      className={`bg-white/90 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200 dark:border-gray-700/50 ${className}`}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Fuel className="h-5 w-5 text-emerald-500" />
          Dispatch Box Capacity
          {getStatusIcon()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Capacity Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-300">
              Used: {usedKegs}/{totalKegs} kegs ({used}L)
            </span>
            <span className="text-gray-600 dark:text-gray-300">
              Available: {remainingKegs} kegs ({remaining}L)
            </span>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${usagePercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`h-full rounded-full ${
                isFull ? "bg-red-500" : isNearFull ? "bg-amber-500" : "bg-emerald-500"
              }`}
            />
          </div>

          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>0 kegs (0L)</span>
            <span>
              {totalKegs} kegs ({total}L)
            </span>
          </div>
        </div>

        {/* Status Message */}
        <div className={`text-sm font-medium ${getStatusColor()}`}>
          {isFull && "⚠️ Dispatch box is full (4/4 kegs) - Complete deliveries to free up space"}
          {isNearFull &&
            !isFull &&
            `🔶 Dispatch box nearly full (${usedKegs}/${totalKegs} kegs used) - Plan your route`}
          {!isNearFull && `✅ Good capacity available (${remainingKegs}/${totalKegs} kegs free for new orders)`}
        </div>

        {/* Refill Button */}
        {used === 0 ? (
          <div className="text-center py-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">🔋 Box is ready for new deliveries</span>
          </div>
        ) : (
          <Button
            onClick={handleRefill}
            disabled={loading || remaining < total}
            variant={remaining < total ? "outline" : "default"}
            className="w-full"
          >
            {loading ? "Processing..." : remaining < total ? "Complete all deliveries first" : "Refill Dispatch Box"}
          </Button>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{totalKegs}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Total Kegs</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{usedKegs}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">In Use</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-600 dark:text-gray-400">{remainingKegs}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Available</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{remaining}L</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Capacity</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default BoxCapacityIndicator
