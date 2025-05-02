import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '@/stores/useAuthStore';
import toast from 'react-hot-toast';

// AdminRoute ensures only admin users can access protected routes
const AdminRoute = ({ children }) => {
  const { user, authenticated, loading, checkAuth } = useAuthStore();
  
  useEffect(() => {
    // Verify admin role on every protected route access
    if (authenticated && user?.role !== 'admin') {
      toast.error("Access denied. Admin privileges required.", {
        duration: 5000,
        id: "admin-access-required", // Prevent duplicate toasts
      });
    }
  }, [authenticated, user]);
  
  // Show loading while checking authentication
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  // Redirect to login if not authenticated
  if (!authenticated) {
    return <Navigate to="/signin" replace />;
  }
  
  // Check if user has admin role
  if (user?.role !== 'admin') {
    // Redirect to signin page if not admin
    return <Navigate to="/signin" replace />;
  }
  
  // If user is authenticated and has admin role, render the children
  return children;
};

export default AdminRoute;