"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const StatsCard = ({ title, value, icon: Icon, description, trend }) => {
  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
      <Card className="bg-white/90 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200 dark:border-gray-700/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</CardTitle>
          {Icon && <Icon className="h-4 w-4 text-emerald-500" />}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
          {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>}
          {trend && (
            <div className="flex items-center pt-1">
              <span className={`text-xs ${trend.positive ? "text-emerald-600" : "text-red-600"}`}>{trend.value}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">from last week</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default StatsCard
