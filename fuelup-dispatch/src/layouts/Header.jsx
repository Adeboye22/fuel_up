"use client"
import { motion } from "framer-motion"
import { Menu, Bell, X, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import useAuthStore from "@/stores/useAuthStore"
import useDispatchStore from "@/stores/useDispatchStore"
import UserAvatar from "./UserAvatar"
import { ModeToggle } from "@/components/mode-toggle"
import MobileStatusToggle from "@/components/MobileStatusToggle"

const Header = ({ onMenuClick, isSidebarOpen }) => {
  const { user, logout } = useAuthStore()
  const { riderStatus, toggleRiderStatus } = useDispatchStore()

  const handleStatusToggle = async () => {
    await toggleRiderStatus()
  }

  const handleLogout = () => {
    logout(true)
  }

  // Get user's first name to display
  const firstName = user?.name?.split(" ")[0] || user?.firstName || "Driver"

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-between items-center mb-4 lg:mb-6 z-20 bg-white/90 dark:bg-gray-800/40 backdrop-blur-2xl dark:border-b dark:border-gray-800 border-gray-700/50 rounded-xl px-4 lg:px-8 py-4 sticky top-4 shadow-sm"
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white focus:outline-none transition-colors md:hidden"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="hidden md:block">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Driver Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back, {firstName}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Desktop Online/Offline Status */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700/40 rounded-full">
          <div className={`w-2 h-2 rounded-full ${riderStatus === "online" ? "bg-emerald-500" : "bg-gray-400"}`} />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {riderStatus === "online" ? "Online" : "Offline"}
          </span>
          <Switch
            checked={riderStatus === "online"}
            onCheckedChange={handleStatusToggle}
            className="data-[state=checked]:bg-emerald-600"
          />
        </div>

        {/* Mobile Online/Offline Status Toggle */}
        <div className="sm:hidden">
          <MobileStatusToggle />
        </div>

        <Separator orientation="vertical" className="h-8 hidden sm:block" />

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 relative">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center">
            3
          </span>
        </Button>

        {/* Theme Toggle */}
        <ModeToggle />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="cursor-pointer ml-1">
              <UserAvatar user={user} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex flex-col space-y-1 p-2">
              <p className="font-medium">{user?.name || `${user?.firstName} ${user?.lastName}`}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <div
                  className={`w-2 h-2 rounded-full ${riderStatus === "online" ? "bg-emerald-500" : "bg-gray-400"}`}
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {riderStatus === "online" ? "Online" : "Offline"}
                </span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 dark:text-red-400 focus:text-red-700 cursor-pointer"
            >
              <LogOut size={14} className="mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  )
}

export default Header
