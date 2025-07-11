"use client"

import { motion } from "framer-motion"
import { Link, useLocation } from "react-router-dom"
import { Home, CheckCircle, User, LogOut, Truck, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import useAuthStore from "@/stores/useAuthStore"
import { cn } from "@/lib/utils"

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation()
  const { logout } = useAuthStore()

  const handleLogout = () => {
    logout(true)
    setOpen(false)
  }

  const handleLinkClick = () => {
    setOpen(false)
  }

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 bg-black/20 dark:bg-black/50 z-30" onClick={() => setOpen(false)} />
      )}

      {/* Sidebar for desktop */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden md:flex w-64 flex-col bg-white/90 dark:bg-gray-800/40 backdrop-blur-md h-screen fixed border-r border-gray-200 dark:border-gray-700/50 py-8 px-4 z-40"
      >
        <SidebarContent handleLogout={handleLogout} handleLinkClick={handleLinkClick} />
      </motion.div>

      {/* Sidebar for mobile */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: open ? 0 : "-100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="md:hidden flex w-full flex-col bg-white/95 dark:bg-gray-800/90 backdrop-blur-md h-screen fixed border-r border-gray-200 dark:border-gray-700/50 py-8 px-4 z-40"
      >
        <div className="flex justify-between items-center mb-6 px-4">
          <div className="inline-flex items-center justify-center h-12 mb-2">
            <img src="/icons/Logo.png" className="h-full" alt="Logo" />
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>
        <SidebarContent handleLogout={handleLogout} handleLinkClick={handleLinkClick} />
      </motion.div>
    </>
  )
}

// Extract sidebar content to avoid repetition
const SidebarContent = ({ handleLogout, handleLinkClick }) => {
  const location = useLocation()
  const currentPath = location.pathname

  const navigation = [
    { name: "Dashboard", href: "/dispatch/dashboard", icon: Home },
    { name: "Active Deliveries", href: "/dispatch/dashboard", icon: Truck },
    { name: "Completed Deliveries", href: "/dispatch/deliveries", icon: CheckCircle },
    { name: "Account", href: "/dispatch/account", icon: User },
  ]

  return (
    <>
      <div className="mb-10 px-4 md:block hidden">
        <div className="inline-flex items-center justify-center h-16 mb-2">
          <img src="/icons/Logo.png" className="h-full" alt="Logo" />
        </div>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <SidebarItem
              key={item.name}
              to={item.href}
              icon={<item.icon size={18} />}
              label={item.name}
              active={currentPath === item.href}
              handleLinkClick={handleLinkClick}
            />
          ))}
        </ul>
      </nav>

      <SupportBox handleLogout={handleLogout} />
    </>
  )
}

const SidebarItem = ({ to, icon, label, active, handleLinkClick }) => {
  return (
    <li>
      <Link
        to={to}
        onClick={handleLinkClick}
        className={cn(
          "flex items-center px-4 py-3 rounded-lg transition-colors",
          active
            ? "text-emerald-700 bg-emerald-50 border-l-4 border-emerald-500 dark:text-white dark:bg-emerald-600/20 dark:border-emerald-500"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-700/30 dark:hover:text-white",
        )}
      >
        <span className="mr-3">{icon}</span>
        <span className={active ? "font-medium" : ""}>{label}</span>
      </Link>
    </li>
  )
}

const SupportBox = ({ handleLogout }) => {
  return (
    <div className="mt-auto space-y-4">
      <div className="p-4 bg-gray-100 dark:bg-gray-700/40 rounded-lg backdrop-blur-sm border border-gray-200 dark:border-gray-600/50">
        <h4 className="font-medium mb-2 text-gray-800 dark:text-white">Need Assistance?</h4>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Our support team is here to help you 24/7</p>
        <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg text-sm transition-colors">
          Contact Support
        </button>
      </div>

      <Button
        variant="ghost"
        onClick={handleLogout}
        className="flex w-full items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/30"
      >
        <LogOut className="h-5 w-5" />
        Sign out
      </Button>
    </div>
  )
}

export default Sidebar
