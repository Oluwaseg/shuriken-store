import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from '../layout';
import ForgotPassword from '../pages/auth/ForgotPassword';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ResendOTP from '../pages/auth/ResendOtp';
import ResetPassword from '../pages/auth/ResetPassword';
import VerifyOtp from '../pages/auth/VerifyOtp';
import Cart from '../pages/cart/Cart';
import CheckoutPage from '../pages/CheckoutPage/CheckoutPage';
import Home from '../pages/Home';
import OrderDetails from '../pages/order/OrderDetails';
import Orders from '../pages/order/Orders';
import PaymentSuccessPage from '../pages/order/PaymentSuccessPage';
import Product from '../pages/Products/Product';
import Products from '../pages/Products/Products';
import Blog from '../pages/static/Blog';
import Contact from '../pages/static/Contact';
import Help from '../pages/static/Help';
import Root from '../pages/static/index';
import NotFound from '../pages/static/NotFound';
import PrivacyPolicy from '../pages/static/PrivacyPolicy';
import TermsAndConditions from '../pages/static/TermsAndConditions';
import Unsubscribe from '../pages/static/Unsubscribe';
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
      <Route
        path='*'
        element={
          <Layout>
            <NotFound />
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
        path='/help'
        element={
          <Layout>
            <Help />
          </Layout>
        }
      />
      <Route
        path='/terms-and-conditions'
        element={
          <Layout>
            <TermsAndConditions />
          </Layout>
        }
      />
      <Route
        path='/unsubscribe'
        element={
          <Layout>
            <Unsubscribe />
          </Layout>
        }
      />
      <Route
        path='/privacy-policy'
        element={
          <Layout>
            <PrivacyPolicy />
          </Layout>
        }
      />

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
            <Layout>
              <Orders />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/orders/:orderId'
        element={
          <ProtectedRoute>
            <Layout>
              <OrderDetails />
            </Layout>
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
        path='/payment-success'
        element={
          <ProtectedRoute>
            <Layout>
              <PaymentSuccessPage />
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
