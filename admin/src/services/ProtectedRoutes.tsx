import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { logoutUser } from "../redux/authSlice";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { token, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!loading && !token) {
      dispatch(logoutUser())
        .unwrap()
        .then(() => {
          toast.error("Session expired. Please log in again.");
        })
        .catch((error: { message: string }) => {
          console.error("Logout failed:", error.message);
          toast.error("Logout failed. Please try again.");
        });
    }
  }, [token, loading, dispatch]);

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
