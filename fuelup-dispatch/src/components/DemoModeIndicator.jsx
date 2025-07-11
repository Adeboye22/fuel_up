"use client"

import { motion } from "framer-motion"
import { Database } from "lucide-react"

const DemoModeIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 right-4 z-50 bg-purple-600/90 backdrop-blur-md text-white px-4 py-2 rounded-lg shadow-lg border border-purple-500/50"
    >
      <div className="flex items-center gap-2 text-sm">
        <Database size={16} />
        <span className="font-medium">Demo Mode</span>
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      </div>
      <div className="text-xs text-purple-200 mt-1">Using mock data • Ready for API integration</div>
    </motion.div>
  )
}

export default DemoModeIndicator
