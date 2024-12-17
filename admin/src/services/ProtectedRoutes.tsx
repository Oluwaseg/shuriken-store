import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import PagePreloader from '../components/PagePreloader';
import { RootState } from '../redux/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token, loading } = useSelector((state: RootState) => state.auth);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center dark:bg-body-dark'>
        <PagePreloader />
      </div>
    );
  }

  return token ? <>{children}</> : <Navigate to='/login' />;
};

export default ProtectedRoute;
