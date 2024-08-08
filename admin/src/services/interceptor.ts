import axios from "axios";
import { store } from "../redux/store";
import { logout } from "../redux/authSlice";
import { toast } from "react-hot-toast";

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());

      toast.error("Session expired. Please log in again.");

      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axios;
