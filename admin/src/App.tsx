import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import Preloader from './components/Preloader';
import Layout from './layouts/Layout';
import Analytics from './pages/Analytics';
import Category from './pages/Category';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import OrderDetailPage from './pages/OrderDetailPage';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Settings from './pages/Settings';
import SubCategory from './pages/SubCategory';
import Users from './pages/Users';
import { RootState } from './redux/store';
import ProtectedRoute from './services/ProtectedRoutes';

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
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  if (loading) {
    return <Preloader />;
  }

  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route
        path='/'
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/analytics'
        element={
          <ProtectedRoute>
            <Layout>
              <Analytics />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/users'
        element={
          <ProtectedRoute>
            <Layout>
              <Users />
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
              <OrderDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/settings'
        element={
          <ProtectedRoute>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/products'
        element={
          <ProtectedRoute>
            <Layout>
              <Products />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/subcategories'
        element={
          <ProtectedRoute>
            <Layout>
              <SubCategory />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/categories'
        element={
          <ProtectedRoute>
            <Layout>
              <Category />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
