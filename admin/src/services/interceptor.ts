// services/interceptor.js
import axios from "axios";
import { store } from "../redux/store";
import { logout } from "../redux/authSlice";
import { toast } from "react-hot-toast";

let isLoggingOut = false;

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !window.location.pathname.includes("/login")
    ) {
      if (isLoggingOut) return Promise.reject(error);

      isLoggingOut = true;
      store.dispatch(logout());
      toast.error("Session expired. Please log in again.");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);

      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default axios;
