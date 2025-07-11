"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Wifi, WifiOff, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import useDispatchStore from "@/stores/useDispatchStore"

const FloatingStatusIndicator = () => {
  const { riderStatus, toggleRiderStatus, isStatusDismissed, setStatusDismissed } = useDispatchStore()
  const [isExpanded, setIsExpanded] = useState(false)

  const handleStatusToggle = async () => {
    await toggleRiderStatus()
  }

  if (isStatusDismissed) return null

  return (
    <div className="sm:hidden fixed bottom-4 left-4 right-4 z-50">
      <AnimatePresence>
        {!isExpanded ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`flex items-center justify-between p-3 rounded-full backdrop-blur-md border shadow-lg cursor-pointer ${
              riderStatus === "online"
                ? "bg-emerald-50/90 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
                : "bg-gray-50/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700"
            }`}
            onClick={() => setIsExpanded(true)}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${
                  riderStatus === "online"
                    ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                }`}
              >
                {riderStatus === "online" ? <Wifi size={16} /> : <WifiOff size={16} />}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {riderStatus === "online" ? "You're Online" : "You're Offline"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {riderStatus === "online" ? "Receiving deliveries" : "Tap to go online"}
                </p>
              </div>
            </div>
            <div className="text-gray-400">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M4 8l2-2 2 2" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl p-4 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Driver Status</h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded(false)}
                  className="h-8 w-8 rounded-full"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M8 4l-2 2-2-2" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  </svg>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setStatusDismissed(true)}
                  className="h-8 w-8 rounded-full"
                >
                  <X size={14} />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${
                    riderStatus === "online"
                      ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {riderStatus === "online" ? <Wifi size={18} /> : <WifiOff size={18} />}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {riderStatus === "online" ? "Online" : "Offline"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {riderStatus === "online" ? "Available for deliveries" : "Not receiving assignments"}
                  </p>
                </div>
              </div>
              <Switch
                checked={riderStatus === "online"}
                onCheckedChange={handleStatusToggle}
                className="data-[state=checked]:bg-emerald-600"
              />
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
              {riderStatus === "online"
                ? "🚛 Ready to receive delivery requests"
                : "💤 Toggle on to start receiving deliveries"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FloatingStatusIndicator
