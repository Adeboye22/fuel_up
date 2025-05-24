import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/components/theme-provider';
import useAuthStore from './stores/useAuthStore';

// Routes
import PublicRoute from './routes/PublicRoute';
import ProtectedRoute from './routes/ProtectedRoute';

import ScrollToTop from './components/ScrollToTop';

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
          {/* <Route path="/signin" element={
            <Suspense>
              <PublicRoute>
                <SignInPage />
              </PublicRoute>
            </Suspense>
          } />
          <Route path="/signup" element={
            <Suspense>
              <PublicRoute>
                <SignUpPage />
              </PublicRoute>
            </Suspense>
          } />
          <Route path="/forgot-password" element={
            <Suspense>
              <PublicRoute>
                <ForgotPasswordPage />
              </PublicRoute>
            </Suspense>
          } />
          <Route path="/verify-email" element={
            <Suspense>
              <PublicRoute>
                <VerifyEmailPage />
              </PublicRoute>
            </Suspense>
          } />
          <Route path="/reset-password" element={
            <Suspense>
              <PublicRoute>
                <ResetPasswordPage />
              </PublicRoute>
            </Suspense>
          } /> */}

          {/* Dashboard routes */}
          {/* <Route path="/dashboard" element={
            <Suspense>
              <ProtectedRoute> 
                <DashboardLayout /> 
              </ProtectedRoute>
            </Suspense>
          }>
            <Route index element={<DashboardHome />} />
            <Route path="order-fuel" element={<OrderFuel />} />
            <Route path="order-history" element={<OrderHistory />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings" element={<Settings />} />
          </Route> */}
          {/* Main routes with MainLayout - wrap with PublicRoute */}
          <Route element={
            <Suspense>
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
