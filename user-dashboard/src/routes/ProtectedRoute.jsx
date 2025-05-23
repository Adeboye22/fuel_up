import { Navigate, useLocation } from "react-router-dom";
import { Suspense } from "react";
import useAuthStore from "../stores/useAuthStore";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { authenticated, loading } = useAuthStore();
  if (!authenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <Suspense>{children}</Suspense>;
};

export default ProtectedRoute;