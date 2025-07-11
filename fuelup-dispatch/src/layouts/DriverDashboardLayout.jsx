"use client"

import { useState } from "react"
import { Outlet } from "react-router-dom"
import Header from "./Header"
import Sidebar from "./Sidebar"
import { ThemeNotification } from "@/components/theme-notification"
import FloatingStatusIndicator from "@/components/FloatingStatusIndicator"

const DriverDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <div className="lg:pl-64">
        <div className="p-4">
          <Header onMenuClick={() => setSidebarOpen(true)} isSidebarOpen={sidebarOpen} />

          <main>
            <div className="mx-auto max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {/* Theme change notification */}
      <ThemeNotification />

      {/* Floating status indicator for mobile */}
      <FloatingStatusIndicator />
    </div>
  )
}

export default DriverDashboardLayout
