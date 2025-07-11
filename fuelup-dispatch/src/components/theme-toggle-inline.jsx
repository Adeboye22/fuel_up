"use client"

import { motion } from "framer-motion"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

export function ThemeToggleInline() {
  const { theme, setTheme } = useTheme()

  const themes = [
    { key: "light", icon: Sun, label: "Light", color: "text-amber-500" },
    { key: "dark", icon: Moon, label: "Dark", color: "text-blue-400" },
    { key: "system", icon: Monitor, label: "System", color: "text-emerald-500" },
  ]

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800/60 rounded-lg backdrop-blur-md">
      {themes.map(({ key, icon: Icon, label, color }) => (
        <motion.button
          key={key}
          onClick={() => setTheme(key)}
          className={`relative flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            theme === key
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Icon className={`h-4 w-4 ${theme === key ? color : ""}`} />
          <span className="hidden sm:inline">{label}</span>
          {theme === key && (
            <motion.div
              layoutId="activeTheme"
              className="absolute inset-0 bg-white dark:bg-gray-700 rounded-md -z-10"
              initial={false}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  )
}
