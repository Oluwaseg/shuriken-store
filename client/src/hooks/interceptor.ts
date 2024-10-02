import { toast } from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';
import { store } from '../app/store';
import { logout } from '../features/auth/authSlice';

const interceptor = () => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = store.getState().auth.token;

      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      const { status } = error.response;

      if (status === 401) {
        store.dispatch(logout());

        toast.error('Session expired. Please log in again.');

        window.location.href = '/login';
      }

      return Promise.reject(error);
    }
  );
};

export default interceptor;
