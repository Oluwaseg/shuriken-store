import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Preloader from './components/PreLoader';
import { useAppSelector } from './hooks';
import Layout from './layout';
import ForgotPassword from './pages/auth/ForgotPassword';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ResendOTP from './pages/auth/ResendOtp';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyOtp from './pages/auth/VerifyOtp';
import Blog from './pages/Blog';
import Cart from './pages/Cart';
import CheckoutPage from './pages/CheckoutPage/CheckoutPage';
import Contact from './pages/Contact';
import Home from './pages/Home';
import Root from './pages/index';
import Orders from './pages/Orders';
import PlaceOrder from './pages/PlaceOrder';
import Product from './pages/Products/Product';
import Products from './pages/Products/Products';
import Profile from './pages/User/Profile';

const App: React.FC = () => {
  const { theme } = useAppSelector((state) => state.theme);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      {loading ? (
        <Preloader />
      ) : (
        <Routes>
          <Route
            path='/'
            element={
              <Layout>
                <Root />
              </Layout>
            }
          />
          <Route
            path='/home'
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />

          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/verify-otp' element={<VerifyOtp />} />
          <Route path='/resend-otp' element={<ResendOTP />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password/:token' element={<ResetPassword />} />

          <Route
            path='/blog'
            element={
              <Layout>
                <Blog />
              </Layout>
            }
          />
          <Route
            path='/contact'
            element={
              <Layout>
                <Contact />
              </Layout>
            }
          />
          <Route
            path='/products'
            element={
              <Layout>
                <Products />
              </Layout>
            }
          />
          <Route
            path='/product/:id'
            element={
              <Layout>
                <Product />
              </Layout>
            }
          />

          <Route
            path='/cart'
            element={
              <Layout>
                <Cart />
              </Layout>
            }
          />
          <Route
            path='/checkout'
            element={
              <Layout>
                <CheckoutPage />
              </Layout>
            }
          />

          <Route
            path='/profile'
            element={
              <Layout>
                <Profile />
              </Layout>
            }
          />

          <Route path='/place-order' element={<PlaceOrder />} />
          <Route path='/orders' element={<Orders />} />
        </Routes>
      )}
      <Toaster position='top-right' />
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
