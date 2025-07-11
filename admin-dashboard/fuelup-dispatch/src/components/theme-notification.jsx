"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { Sun, Moon, Monitor, Check } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

export function ThemeNotification() {
  const { theme } = useTheme()
  const [showNotification, setShowNotification] = useState(false)
  const [previousTheme, setPreviousTheme] = useState(theme)

  useEffect(() => {
    if (theme !== previousTheme && previousTheme) {
      setShowNotification(true)
      const timer = setTimeout(() => setShowNotification(false), 2000)
      return () => clearTimeout(timer)
    }
    setPreviousTheme(theme)
  }, [theme, previousTheme])

  const getThemeInfo = () => {
    switch (theme) {
      case "light":
        return { icon: Sun, label: "Light mode", color: "text-amber-500" }
      case "dark":
        return { icon: Moon, label: "Dark mode", color: "text-blue-400" }
      default:
        return { icon: Monitor, label: "System theme", color: "text-emerald-500" }
    }
  }

  const themeInfo = getThemeInfo()
  const Icon = themeInfo.icon

  return (
    <AnimatePresence>
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-4 right-4 z-50 flex items-center gap-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200 dark:border-gray-700/50 rounded-lg px-4 py-3 shadow-lg"
        >
          <div className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${themeInfo.color}`} />
            <span className="text-sm font-medium text-gray-900 dark:text-white">{themeInfo.label}</span>
          </div>
          <Check className="h-4 w-4 text-emerald-500" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
