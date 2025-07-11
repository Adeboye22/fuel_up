"use client"

import { motion } from "framer-motion"
import { Moon, Sun, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-[1.2rem] w-[1.2rem] text-amber-500" />
      case "dark":
        return <Moon className="h-[1.2rem] w-[1.2rem] text-blue-400" />
      default:
        return <Monitor className="h-[1.2rem] w-[1.2rem] text-emerald-500" />
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-9 w-9 bg-white/90 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all duration-200"
        >
          <motion.div
            key={theme}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {getThemeIcon()}
          </motion.div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border border-gray-200 dark:border-gray-700/50"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/30"
        >
          <Sun className="mr-2 h-4 w-4 text-amber-500" />
          <span>Light</span>
          {theme === "light" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto w-2 h-2 bg-emerald-500 rounded-full"
            />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/30"
        >
          <Moon className="mr-2 h-4 w-4 text-blue-400" />
          <span>Dark</span>
          {theme === "dark" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto w-2 h-2 bg-emerald-500 rounded-full"
            />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/30"
        >
          <Monitor className="mr-2 h-4 w-4 text-emerald-500" />
          <span>System</span>
          {theme === "system" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto w-2 h-2 bg-emerald-500 rounded-full"
            />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
