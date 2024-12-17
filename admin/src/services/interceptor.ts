import { toast } from 'react-hot-toast';
import { logout } from '../redux/authSlice';
import { store } from '../redux/store';
import apiClient from './apiClient';

let isLoggingOut = false;

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !window.location.pathname.includes('/login')
    ) {
      if (isLoggingOut) return Promise.reject(error);

      isLoggingOut = true;
      store.dispatch(logout());
      toast.error('Session expired. Please log in again.');

      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);

      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
