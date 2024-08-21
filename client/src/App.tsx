import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAppSelector } from "./hooks";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ResendOTP from "./pages/auth/ResendOtp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Root from "./pages/index";
import Home from "./pages/Home";
import Layout from "./layout";
import Product from "./pages/Products/Product";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import PlaceOrder from "./pages/PlaceOrder";
import Products from "./pages/Products/Products";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import Preloader from "./components/PreLoader";

const App: React.FC = () => {
  const { theme } = useAppSelector((state) => state.theme);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={theme === "dark" ? "dark" : ""}>
      {loading ? (
        <Preloader />
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Root />
              </Layout>
            }
          />
          <Route
            path="/home"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/resend-otp" element={<ResendOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route
            path="/blog"
            element={
              <Layout>
                <Blog />
              </Layout>
            }
          />
          <Route
            path="/contact"
            element={
              <Layout>
                <Contact />
              </Layout>
            }
          />
          <Route
            path="/products"
            element={
              <Layout>
                <Products />
              </Layout>
            }
          />
          <Route
            path="/product/:id"
            element={
              <Layout>
                <Product />
              </Layout>
            }
          />

          <Route path="/cart" element={<Cart />} />

          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      )}
      <Toaster position="top-right" />
    </div>
  );
};

const WrappedApp: React.FC = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default WrappedApp;
