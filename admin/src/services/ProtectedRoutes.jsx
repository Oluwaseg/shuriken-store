import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);

  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
