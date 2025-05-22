import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/components/theme-provider';
import useAuthStore from './stores/useAuthStore';

// Routes
import PublicRoute from './routes/PublicRoute';
import AdminRoute from './routes/AdminRoute';

// Loading spinner
import LoadingSpinner from './components/LoadingSpinner';
import ScrollToTop from './components/ScrollToTop';

// Layouts
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));

// Auth pages
const SignInPage = lazy(() => import('./pages/auth/SignInPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));
const Unauthorized = lazy(() => import('./pages/auth/Unauthorized'));

// Admin pages - import directly for better performance (no need for lazy loading these)
import AdminDashboard from './pages/dashboard/AdminDashboard';
import UserManagement from './pages/dashboard/UserManagement';
import OrderManagement from './pages/dashboard/OrderManagement';
import AdminSettings from './pages/dashboard/AdminSettings';
import Notifications from './pages/dashboard/Notifications';
import AdminTicketManagement from './pages/dashboard/AdminTicketManagement';

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Toaster position="top-right" />
        <ScrollToTop />
        
        <Routes>
          {/* Auth routes - using restricted=true to redirect if already logged in */}
          <Route
            path="/signin"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <PublicRoute restricted={true}>
                  <SignInPage />
                </PublicRoute>
              </Suspense>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <PublicRoute restricted={true}>
                  <ForgotPasswordPage />
                </PublicRoute>
              </Suspense>
            }
          />
          <Route
            path="/reset-password"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <PublicRoute restricted={true}>
                  <ResetPasswordPage />
                </PublicRoute>
              </Suspense>
            }
          />
          
          {/* Unauthorized access page */}
          <Route
            path="/unauthorized"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <PublicRoute>
                  <Unauthorized />
                </PublicRoute>
              </Suspense>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              </Suspense>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="ticket-management" element={<AdminTicketManagement />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Redirect from root to /admin or /signin based on auth status */}
          <Route 
            path="/" 
            element={
              <Navigate to="/admin" replace />
            } 
          />
          
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;