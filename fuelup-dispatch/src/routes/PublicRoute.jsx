import { Navigate } from "react-router-dom"
import useAuthStore from "@/stores/useAuthStore"
import LoadingSpinner from "@/components/LoadingSpinner"

const PublicRoute = ({ children }) => {
  const { authenticated, user, isInitialized } = useAuthStore()

  // Wait for initialization before making routing decisions
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
        <LoadingSpinner />
      </div>
    )
  }

  if (authenticated && (user?.role === "driver" || user?.userType === "driver")) {
    return <Navigate to="/dispatch/dashboard" replace />
  }

  return children
}

export default PublicRoute
