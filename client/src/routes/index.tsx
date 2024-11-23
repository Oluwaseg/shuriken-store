import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from '../layout';
import ForgotPassword from '../pages/auth/ForgotPassword';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ResendOTP from '../pages/auth/ResendOtp';
import ResetPassword from '../pages/auth/ResetPassword';
import VerifyOtp from '../pages/auth/VerifyOtp';
import Blog from '../pages/Blog';
import Cart from '../pages/Cart';
import CheckoutPage from '../pages/CheckoutPage/CheckoutPage';
import Confirmation from '../pages/Confirmation';
import Contact from '../pages/Contact';
import Home from '../pages/Home';
import Root from '../pages/index';
import Orders from '../pages/Orders';
import PlaceOrder from '../pages/PlaceOrder';
import Product from '../pages/Products/Product';
import Products from '../pages/Products/Products';
import Profile from '../pages/User/Profile';
import ProtectedRoute from '../utils/Verify-Route';

const RoutesConfig: React.FC = () => {
  return (
    <Routes>
      <Route
        path='/'
        element={
          <Layout>
            <Root />
          </Layout>
        }
      />
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route path='/verify-otp' element={<VerifyOtp />} />
      <Route path='/resend-otp' element={<ResendOTP />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route path='/reset-password/:token' element={<ResetPassword />} />

      {/* Protected Routes */}
      <Route
        path='/home'
        element={
          <ProtectedRoute>
            <Layout>
              <Home />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/profile'
        element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/orders'
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route
        path='/place-order'
        element={
          <ProtectedRoute>
            <PlaceOrder />
          </ProtectedRoute>
        }
      />
      <Route
        path='/checkout'
        element={
          <ProtectedRoute>
            <Layout>
              <CheckoutPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/confirmation'
        element={
          <ProtectedRoute>
            <Layout>
              <Confirmation />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Other Routes */}
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
    </Routes>
  );
};

export default RoutesConfig;
