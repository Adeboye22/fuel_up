import { Navigate, useLocation } from 'react-router-dom';
import { Suspense } from 'react';
import useAuthStore from '@/stores/useAuthStore';

const PublicRoute = ({ children }) => {
  const location = useLocation();
  const { authenticated, loading } = useAuthStore();


  if (authenticated) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return <Suspense>{children}</Suspense>;
};


export default PublicRoute;