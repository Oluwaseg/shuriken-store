import axios from 'axios';

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === 'development'
      ? '/api'
      : import.meta.env.VITE_API_BASE_URL, // Use '/api' in development for Vite proxy
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    return Promise.reject(error);
  }
);

export default axiosInstance;
