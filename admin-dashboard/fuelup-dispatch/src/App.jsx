"use client"

import { Suspense, lazy, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import PublicRoute from "./routes/PublicRoute"
import ProtectedRoute from "./routes/ProtectedRoute"
import AuthGuard from "./components/AuthGuard"
import ScrollToTop from "./components/ScrollToTop"
import { Toaster } from "react-hot-toast"
import useAuthStore from "./stores/useAuthStore"
import LoadingSpinner from "./components/LoadingSpinner"
import { ThemeProvider } from "./components/theme-provider"

// Lazy load components
const DriverDashboardLayout = lazy(() => import("./layouts/DriverDashboardLayout"))
const SignIn = lazy(() => import("./pages/auth/SignIn"))
const Dashboard = lazy(() => import("./pages/dispatch/Dashboard"))
const Deliveries = lazy(() => import("./pages/dispatch/Deliveries"))
const ConfirmDelivery = lazy(() => import("./pages/dispatch/ConfirmDelivery"))
const Account = lazy(() => import("./pages/dispatch/Account"))

function App() {
  const { checkAuth, authenticated, user, isInitialized } = useAuthStore()

  useEffect(() => {
    // Only call checkAuth if we don't have persisted auth data
    const hasPersistedAuth = authenticated && user
    if (!hasPersistedAuth) {
      checkAuth()
    }
  }, [checkAuth, authenticated, user])

  const isDriver = user?.role === "driver" || user?.userType === "driver"

  // Show loading screen while initializing
  if (!isInitialized) {
    return (
      <ThemeProvider defaultTheme="system" storageKey="fuelup-driver-theme">
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading FuelUp Driver...</p>
          </div>
        </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="fuelup-driver-theme">
      <Router>
        <AuthGuard>
          <Toaster position="top-right" />
          <Routes>
            {/* Public Routes */}
            <Route
              path="/signin"
              element={
                <PublicRoute>
                  <Suspense fallback={<LoadingSpinner />}>
                    <SignIn />
                  </Suspense>
                </PublicRoute>
              }
            />

            {/* Protected Dispatch Routes */}
            {authenticated && isDriver && (
              <Route
                path="/dispatch"
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <ProtectedRoute>
                      <DriverDashboardLayout />
                    </ProtectedRoute>
                  </Suspense>
                }
              >
                <Route index element={<Navigate to="/dispatch/dashboard" replace />} />
                <Route
                  path="dashboard"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <Dashboard />
                    </Suspense>
                  }
                />
                <Route
                  path="deliveries"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <Deliveries />
                    </Suspense>
                  }
                />
                <Route
                  path="confirm/:orderId"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <ConfirmDelivery />
                    </Suspense>
                  }
                />
                <Route
                  path="account"
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <Account />
                    </Suspense>
                  }
                />
              </Route>
            )}

            {/* Default redirects */}
            <Route
              path="*"
              element={
                authenticated && isDriver ? (
                  <Navigate to="/dispatch/dashboard" replace />
                ) : (
                  <Navigate to="/signin" replace />
                )
              }
            />
          </Routes>
          <ScrollToTop />
        </AuthGuard>
      </Router>
    </ThemeProvider>
  )
}

export default App
