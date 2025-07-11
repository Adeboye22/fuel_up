"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Settings, Database, RefreshCw, AlertTriangle, Users, Fuel } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockScenarios } from "@/services/notificationService"
import useDispatchStore from "@/stores/useDispatchStore"
import toast from "react-hot-toast"

const MockDataControls = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { fetchAssignments } = useDispatchStore()

  const handleScenario = async (scenarioName, scenarioFn) => {
    try {
      scenarioFn()
      await fetchAssignments()
      toast.success(`Applied scenario: ${scenarioName}`)
    } catch (error) {
      toast.error(`Failed to apply scenario: ${error.message}`)
    }
  }

  const scenarios = [
    {
      name: "Near Full Capacity",
      description: "Set box to 35L/40L used",
      icon: AlertTriangle,
      color: "text-amber-600",
      action: () => handleScenario("Near Full Capacity", mockScenarios.setNearFullCapacity),
    },
    {
      name: "Full Capacity",
      description: "Set box to 40L/40L used",
      icon: Fuel,
      color: "text-red-600",
      action: () => handleScenario("Full Capacity", mockScenarios.setFullCapacity),
    },
    {
      name: "Grouped Orders",
      description: "Add orders on same street",
      icon: Users,
      color: "text-blue-600",
      action: () => handleScenario("Grouped Orders", mockScenarios.addGroupedOrders),
    },
    {
      name: "Reset Data",
      description: "Reset to default state",
      icon: RefreshCw,
      color: "text-emerald-600",
      action: () => handleScenario("Reset Data", mockScenarios.reset),
    },
  ]

  if (!isOpen) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-full shadow-lg transition-colors"
        title="Mock Data Controls"
      >
        <Database size={20} />
      </motion.button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 left-4 z-50 w-80"
    >
      <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-purple-200 dark:border-purple-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
              <Settings size={18} />
              Mock Data Controls
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-6 w-6 p-0">
              ×
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-3">
            🧪 Test different scenarios with mock data
          </div>

          {scenarios.map((scenario, index) => (
            <motion.div
              key={scenario.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                onClick={scenario.action}
                variant="outline"
                className="w-full justify-start h-auto p-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 bg-transparent"
              >
                <div className="flex items-center gap-3">
                  <scenario.icon className={`h-4 w-4 ${scenario.color}`} />
                  <div className="text-left">
                    <div className="font-medium text-sm">{scenario.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{scenario.description}</div>
                  </div>
                </div>
              </Button>
            </motion.div>
          ))}

          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              💡 These controls simulate different system states for testing
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default MockDataControls
