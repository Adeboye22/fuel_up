"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Package, Clock, CheckCircle, Truck, MapPin } from "lucide-react"
import StatsCard from "@/components/dashboard/StatsCard"
import DeliveryCard from "@/components/dashboard/DeliveryCard"
import LoadingSpinner from "@/components/LoadingSpinner"
import useDispatchStore from "@/stores/useDispatchStore"
import { Button } from "@/components/ui/button"
import useAuthStore from "@/stores/useAuthStore"

const Dashboard = () => {
  const { user } = useAuthStore()
  const { assignments, loading, fetchAssignments, riderStatus } = useDispatchStore()

  useEffect(() => {
    fetchAssignments()
  }, [fetchAssignments])

  // const activeDeliveries = assignments.filter((d) => ["assigned", "accepted", "in_progress"].includes(d.status))
  const activeDeliveries = assignments.filter((d) => ["assigned", "accepted", "in_progress"].includes(d.status))

  const todayDeliveries = assignments.filter((d) => {
    const today = new Date().toDateString()
    return new Date(d.created_at).toDateString() === today
  })

  // Get user's first name to display
  const firstName = user?.name?.split(" ")[0] || user?.firstName || "Driver"

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-6">
      {/* Mobile title */}
      <div className="md:hidden">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white">Dashboard</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">Hi, {firstName}</p>
      </div>
      {/* Quick Actions */}
      <QuickActions riderStatus={riderStatus} />

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatsCard
          title="Active Deliveries"
          value={activeDeliveries.length}
          icon={Truck}
          description="Currently assigned to you"
        />
        <StatsCard
          title="Today's Deliveries"
          value={todayDeliveries.length}
          icon={Package}
          description="Deliveries for today"
        />
        <StatsCard
          title="Pending Acceptance"
          value={assignments.filter((d) => d.status === "assigned").length}
          icon={Clock}
          description="Waiting for your response"
        />
        <StatsCard
          title="In Progress"
          value={assignments.filter((d) => d.status === "in_progress").length}
          icon={CheckCircle}
          description="Currently delivering"
        />
      </motion.div>

      {/* Active Deliveries */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Deliveries</h2>
          <Button asChild variant="outline">
            <Link to="/dispatch/deliveries">View All</Link>
          </Button>
        </div>

        {activeDeliveries.length === 0 ? (
          <div className="text-center py-12 bg-white/90 dark:bg-gray-800/40 backdrop-blur-md rounded-xl border border-gray-200 dark:border-gray-700/50">
            <Truck className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No active deliveries</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {riderStatus === "offline"
                ? "Go online to receive delivery assignments"
                : "New deliveries will appear here when assigned"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeDeliveries.slice(0, 6).map((delivery) => (
              <DeliveryCard key={delivery.id} delivery={delivery} type="assigned" />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

const QuickActions = ({ riderStatus }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
    >
      <ActionCard
        title="Go Online"
        description={riderStatus === "online" ? "You're online" : "Start receiving orders"}
        icon={<Truck size={24} />}
        primary={riderStatus === "offline"}
        disabled={riderStatus === "online"}
      />
      <ActionCard
        title="View Deliveries"
        description="Check completed orders"
        icon={<CheckCircle size={24} />}
        href="/dispatch/deliveries"
      />
      <ActionCard
        title="Account Settings"
        description="Update your profile"
        icon={<MapPin size={24} />}
        href="/dispatch/account"
      />
    </motion.div>
  )
}

// Action Card Component
const ActionCard = ({ title, description, icon, primary = false, disabled = false, href, onClick }) => {
  const content = (
    <motion.div
      whileHover={!disabled ? { scale: 1.02 } : {}}
      className={`${
        primary && !disabled
          ? "bg-emerald-600"
          : "bg-white/90 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200 dark:border-gray-700/50"
      } ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      } rounded-xl p-4 shadow-md flex items-center justify-between transition-all`}
    >
      <div>
        <h3
          className={`text-lg font-semibold mb-1 ${
            primary && !disabled ? "text-white" : "text-gray-800 dark:text-white"
          }`}
        >
          {title}
        </h3>
        <p className={`${primary && !disabled ? "text-emerald-100" : "text-gray-500 dark:text-gray-400"} text-sm`}>
          {description}
        </p>
      </div>
      <div
        className={`${
          primary && !disabled ? "bg-emerald-500 text-white" : "bg-gray-100 dark:bg-gray-700"
        } p-3 rounded-lg`}
      >
        {icon}
      </div>
    </motion.div>
  )

  if (disabled) {
    return content
  }

  if (href) {
    return <Link to={href}>{content}</Link>
  }

  return <div onClick={onClick}>{content}</div>
}

export default Dashboard
