import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/user/login", { email, password });
      return response.data;
    } catch (error) {
      const status = error.response?.status;
      let message = "Login failed. Please try again.";

      if (status === 400) {
        message = "Please enter a valid email and password.";
      } else if (status === 401) {
        message = "Invalid email or password.";
      } else if (status === 404) {
        message = "User not found.";
      }

      return rejectWithValue({ message });
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/api/user/logout",
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data.message || "Logout failed. Please try again.",
      });
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    setAuth: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.loading = false;
        state.successMessage = "Login successful!";
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.successMessage = null;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.loading = false;
        state.successMessage = "Logout successful!";
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.successMessage = null;
      });
  },
});

export const { logout, setAuth } = authSlice.actions;
export default authSlice.reducer;
