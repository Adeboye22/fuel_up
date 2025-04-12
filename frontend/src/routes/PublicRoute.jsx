import { Navigate, useLocation } from 'react-router-dom';
import { Suspense } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import useAuthStore from '../stores/useAuthStore';

const PublicRoute = ({ children }) => {
  const location = useLocation();
  const { authenticated, loading } = useAuthStore();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (authenticated) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
};


export default PublicRoute;