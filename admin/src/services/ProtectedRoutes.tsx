import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Spinner from "../components/Spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token, loading } = useSelector((state: RootState) => state.auth);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-800">
        <Spinner />
      </div>
    );
  }

  return token ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;
