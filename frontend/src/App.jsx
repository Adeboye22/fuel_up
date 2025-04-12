import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ScrollToTop from './components/ScrollToTop';
import { ThemeProvider } from '@/components/theme-provider';
import useAuthStore from './stores/useAuthStore';

// Routes
import PublicRoute from './routes/PublicRoute';
import ProtectedRoute from './routes/ProtectedRoute';

// Loading spinner
const LoadingSpinner = lazy(() => import('./components/LoadingSpinner'));

// Layouts
const MainLayout = lazy(() => import('./layouts/MainLayout'));
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'));

// Main pages
const Home = lazy(() => import('./pages/Home'));

// Auth pages
const SignInPage = lazy(() => import('./pages/auth/SignIn'));
const SignUpPage = lazy(() => import('./pages/auth/SignUp'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const VerifyEmailPage = lazy(() => import('./pages/auth/VerifyEmailPage'));
const VerifyOtpPage = lazy(() => import('./pages/auth/VerifyOtpPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));

// Dashboard pages
const DashboardHome = lazy(() => import('./pages/dashboard/DashBoardHome'));
const OrderFuel = lazy(() => import('./pages/dashboard/OrderFuel'));
const OrderHistory = lazy(() => import('./pages/dashboard/OrderHistory'));
const NotificationsPage = lazy(() => import('./pages/dashboard/NotificationsPage'));
const Settings = lazy(() => import('./pages/dashboard/Settings'));

function App() {  
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Auth routes without layout */}
          <Route path="/signin" element={
            <Suspense fallback={<LoadingSpinner />}>
              <PublicRoute>
                <SignInPage />
              </PublicRoute>
            </Suspense>
          } />
          <Route path="/signup" element={
            <Suspense fallback={<LoadingSpinner />}>
              <PublicRoute>
                <SignUpPage />
              </PublicRoute>
            </Suspense>
          } />
          <Route path="/forgot-password" element={
            <Suspense fallback={<LoadingSpinner />}>
              <PublicRoute>
                <ForgotPasswordPage />
              </PublicRoute>
            </Suspense>
          } />
          <Route path="/verify-email" element={
            <Suspense fallback={<LoadingSpinner />}>
              <PublicRoute>
                <VerifyEmailPage />
              </PublicRoute>
            </Suspense>
          } />
          <Route path="/verify-otp" element={
            <Suspense fallback={<LoadingSpinner />}>
              <PublicRoute>
                <VerifyOtpPage />
              </PublicRoute>
            </Suspense>
          } />
          <Route path="/reset-password" element={
            <Suspense fallback={<LoadingSpinner />}>
              <PublicRoute>
                <ResetPasswordPage />
              </PublicRoute>
            </Suspense>
          } />

          {/* Dashboard routes */}
          <Route path="/dashboard" element={
            <Suspense fallback={<LoadingSpinner />}>
              <PublicRoute>
                <DashboardLayout /> 
              </PublicRoute>
            </Suspense>
          }>
            <Route index element={<DashboardHome />} />
            <Route path="order-fuel" element={<OrderFuel />} />
            <Route path="order-history" element={<OrderHistory />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Main routes with MainLayout - wrap with PublicRoute */}
          <Route element={
            <Suspense fallback={<LoadingSpinner />}>
              <PublicRoute>
                <MainLayout />
              </PublicRoute>
            </Suspense>
          }>
            <Route index element={<Home />} />
          </Route>
        </Routes>
        <ScrollToTop />
      </Router>
    </ThemeProvider>
  );
}

export default App;
