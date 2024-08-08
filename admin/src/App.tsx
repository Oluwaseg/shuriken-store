import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import RootLayout from "./layouts/RootLayout";
import AllApps from "./pages/AllApps";
import Users from "./pages/Users";
import Orders from "./pages/Orders";
import Settings from "./pages/Settings";
import Products from "./pages/Products";
import Category from "./pages/Category";
import Create from "./pages/Create";
import CreateCategory from "./pages/AddCategory";
import Login from "./pages/Login";
import ProtectedRoute from "./services/ProtectedRoutes";
import Preloader from "./components/Preloader";
import { RootState, AppDispatch } from "./redux/store";
import { toggleDarkMode } from "./redux/darkModeSlice";

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch<AppDispatch>();
  const isDarkMode = useSelector(
    (state: RootState) => state.darkMode.isDarkMode
  );

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Apply dark mode class to body
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
              <AllApps />
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
        path="/products/create"
        element={
          <ProtectedRoute>
            <RootLayout>
              <Create />
            </RootLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories/create"
        element={
          <ProtectedRoute>
            <RootLayout>
              <CreateCategory />
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
