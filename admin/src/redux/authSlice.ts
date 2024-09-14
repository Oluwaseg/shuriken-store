import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Define TypeScript interfaces for the state and payload
interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

// Async thunk for login
export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginPayload,
  { rejectValue: { message: string } }
>("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post<AuthResponse>("/api/admin/login", {
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
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
});

// Async thunk for logout
export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: { message: string } }
>("auth/logoutUser", async (_, { rejectWithValue }) => {
  try {
    await axios.post("/api/user/logout", {}, { withCredentials: true });
  } catch (error: any) {
    return rejectWithValue({
      message:
        error.response?.data.message || "Logout failed. Please try again.",
    });
  }
});

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user") || "null") as User | null,
    token: localStorage.getItem("token") || null,
    loading: false,
  } as AuthState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    setAuth: (state, action: PayloadAction<AuthResponse>) => {
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
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.loading = false;
          localStorage.setItem("token", action.payload.token);
          localStorage.setItem("user", JSON.stringify(action.payload.user));
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.loading = false;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { logout, setAuth } = authSlice.actions;
export default authSlice.reducer;
