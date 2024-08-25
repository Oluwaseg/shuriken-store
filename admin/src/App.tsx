import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import RootLayout from "./layouts/RootLayout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Orders from "./pages/Orders";
import Settings from "./pages/Settings";
import Products from "./pages/Products";
import Category from "./pages/Category";
import Login from "./pages/Login";
import OrderDetailPage from "./pages/OrderDetailPage";
import ProtectedRoute from "./services/ProtectedRoutes";
import Preloader from "./components/Preloader";
import { RootState } from "./redux/store";
import SubCategory from "./pages/SubCategory";

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const isDarkMode = useSelector(
    (state: RootState) => state.darkMode.isDarkMode
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  if (loading) {
    return <Preloader />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <RootLayout>
              <Dashboard />
            </RootLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <RootLayout>
              <Users />
            </RootLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <RootLayout>
              <Orders />
            </RootLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders/:orderId"
        element={
          <ProtectedRoute>
            <RootLayout>
              <OrderDetailPage />
            </RootLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <RootLayout>
              <Settings />
            </RootLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <RootLayout>
              <Products />
            </RootLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/subcategories"
        element={
          <ProtectedRoute>
            <RootLayout>
              <SubCategory />
            </RootLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <RootLayout>
              <Category />
            </RootLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
