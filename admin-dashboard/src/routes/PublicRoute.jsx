import useAuthStore from '@/stores/useAuthStore';
import { Navigate } from 'react-router-dom';

// PublicRoute is accessible to anyone
const PublicRoute = ({ children, restricted = false }) => {
  const { authenticated, loading, user } = useAuthStore();
  
  // Show loading while checking authentication
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  // If authenticated and route is restricted (like login page), redirect to admin dashboard
  if (authenticated && restricted && user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  
  // Otherwise render children
  return children;
};

export default PublicRoute;