"use client"

import { motion } from "framer-motion"
import { Wifi, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import useDispatchStore from "@/stores/useDispatchStore"

const MobileStatusToggle = ({ className = "" }) => {
  const { riderStatus, toggleRiderStatus } = useDispatchStore()

  const handleStatusToggle = async () => {
    await toggleRiderStatus()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-full h-9 w-9 transition-all duration-200 ${
            riderStatus === "online"
              ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/30"
              : "bg-gray-100 dark:bg-gray-700/40 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700/60"
          } ${className}`}
        >
          <motion.div
            key={riderStatus}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {riderStatus === "online" ? <Wifi size={18} /> : <WifiOff size={18} />}
          </motion.div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md">
        <div className="px-3 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Driver Status</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Toggle your availability</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${riderStatus === "online" ? "bg-emerald-500" : "bg-gray-400"}`} />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {riderStatus === "online" ? "Online" : "Offline"}
              </span>
            </div>
            <Switch
              checked={riderStatus === "online"}
              onCheckedChange={handleStatusToggle}
              className="data-[state=checked]:bg-emerald-600"
            />
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 px-1">
            {riderStatus === "online"
              ? "✅ You're available for new deliveries"
              : "⏸️ You won't receive new assignments"}
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default MobileStatusToggle
