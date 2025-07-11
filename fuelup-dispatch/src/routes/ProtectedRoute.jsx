import { Navigate, useLocation } from "react-router-dom"
import useAuthStore from "@/stores/useAuthStore"
import LoadingSpinner from "@/components/LoadingSpinner"

const ProtectedRoute = ({ children }) => {
  const { authenticated, user, loading, isInitialized } = useAuthStore()
  const location = useLocation()

  // Show loading while checking authentication or while not initialized
  if (loading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
        <LoadingSpinner />
      </div>
    )
  }

  if (!authenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />
  }

  // Check if user has driver role
  if (user?.role !== "driver" && user?.userType !== "driver") {
    return <Navigate to="/signin" replace />
  }

  return children
}

export default ProtectedRoute
