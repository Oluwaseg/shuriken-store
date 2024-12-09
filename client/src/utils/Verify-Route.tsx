import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const location = useLocation();

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to='/login' state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
