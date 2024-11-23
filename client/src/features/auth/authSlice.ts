import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';
import axiosInstance from '../../api/axiosInstance';
import { AuthState, ErrorResponse } from '../../types/type';
import { mergeGuestCart } from '../cart/cartSlice';

const initialState: AuthState = {
  loading: false,
  userInfo: (() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        return JSON.parse(userInfo);
      } catch (error) {
        console.error('Failed to parse userInfo from localStorage:', error);
        return null;
      }
    }
    return null;
  })(),
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  error: null,
};

export const register = createAsyncThunk(
  'auth/register',
  async (
    userData: { name: string; email: string; password: string; avatar?: File },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('email', userData.email);
      formData.append('password', userData.password);
      if (userData.avatar) {
        formData.append('avatar', userData.avatar);
      }

      const response = await axiosInstance.post('/user/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(response.data.message);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        (error as { response: { data: ErrorResponse } }).response?.data
      );
    }
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async (otpData: { otp: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/user/verify-otp', otpData);
      toast.success('OTP verified successfully!');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        (error as { response: { data: ErrorResponse } }).response?.data
      );
    }
  }
);

export const resendOTP = createAsyncThunk(
  'auth/resendOTP',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/user/resend-otp', { email });
      toast.success('OTP has been resent. Please check your email.');
      return response.data;
    } catch (error) {
      const errorResponse = (
        error as { response: { data: ErrorResponse; status: number } }
      ).response;

      // Return specific backend error messages based on status
      if (errorResponse.status === 404) {
        return rejectWithValue({
          message: 'User not found. Please check the email address.',
          status: 404,
        });
      }

      if (errorResponse.status === 400) {
        return rejectWithValue({
          message: 'User already verified.',
          status: 400,
        });
      }

      return rejectWithValue({
        message: 'An error occurred. Please try again later.',
        status: errorResponse.status || 500,
      });
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (
    loginData: { email: string; password: string },
    { rejectWithValue, dispatch } // Add dispatch here
  ) => {
    try {
      const response = await axiosInstance.post('/user/login', loginData);
      toast.success('Login successful!');

      const guestCart = JSON.parse(localStorage.getItem('cart') || 'null');
      if (guestCart && guestCart.items.length > 0) {
        // Call mergeCart API to merge guest cart with user cart
        await dispatch(
          mergeGuestCart({
            guestCart: guestCart.items,
            userId: response.data.user._id,
          })
        );
        // Clear guest cart from local storage after merging
        localStorage.removeItem('cart');
      }

      return response.data;
    } catch (error) {
      const errorResponse = (
        error as { response: { data: ErrorResponse; status: number } }
      ).response;

      if (errorResponse.status === 400) {
        return rejectWithValue({
          message: 'User not verified. Please verify your email.',
          status: 400,
        });
      }

      if (errorResponse.status === 401) {
        return rejectWithValue({
          message: 'Invalid email or password.',
          status: 401,
        });
      }

      return rejectWithValue({
        message: 'An error occurred during login.',
        status: errorResponse.status || 500,
      });
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post('/user/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      toast.success('Logged out successfully!');
      return;
    } catch (error) {
      return rejectWithValue(
        (error as { response: { data: ErrorResponse } }).response?.data
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/user/forgot-password', {
        email,
      });
      toast.success('Password reset email sent!');
      return response.data;
    } catch (error) {
      const errorResponse = (
        error as { response: { data: ErrorResponse; status: number } }
      ).response;
      const message = errorResponse?.data?.message || 'An error occurred';

      if (errorResponse?.status === 404) {
        return rejectWithValue({
          message: 'User not found. Please check the email address.',
          status: 404,
        });
      }

      return rejectWithValue({
        message,
        status: errorResponse?.status || 500,
      });
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (
    data: { token: string; password: string; confirmPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(
        `/user/reset-password/${data.token}`,
        data
      );
      toast.success('Password reset successful!');
      return response.data;
    } catch (error) {
      return rejectWithValue(
        (error as { response: { data: ErrorResponse } }).response?.data
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.loading = false;
      state.error = null;
    },
    loadUserFromStorage: (state) => {
      const token = localStorage.getItem('token');
      if (token) {
        state.token = token;
        state.isAuthenticated = true;
      }
    },
    updateAuthUserInfo: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as ErrorResponse)?.message || 'An error occurred';
      })

      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as ErrorResponse)?.message || 'An error occurred';
      })

      .addCase(resendOTP.pending, (state) => {
        state.loading = true;
      })
      .addCase(resendOTP.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.loading = false;

        const errorPayload = action.payload as {
          message: string;
          status: number;
        };

        if (errorPayload.status === 404) {
          state.error = 'User not found. Please check the email address.';
        } else if (errorPayload.status === 400) {
          state.error = 'User already verified.';
        } else {
          state.error = 'An error occurred. Please try again.';
        }
      })

      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('userInfo', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;

        const errorPayload = action.payload as {
          message: string;
          status: number;
        };

        if (errorPayload.status === 400) {
          state.error = 'User not verified. Please verify your email address.';
        } else if (errorPayload.status === 401) {
          state.error = null;
          toast.error('Invalid email or password');
        } else {
          state.error = 'An error occurred during login.';
        }
      })

      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.userInfo = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as ErrorResponse)?.message || 'An error occurred';
      })

      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as ErrorResponse)?.message || 'An error occurred';
      })

      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as ErrorResponse)?.message || 'An error occurred';
      });
  },
});

export const { resetAuthState, loadUserFromStorage, updateAuthUserInfo } =
  authSlice.actions;
export default authSlice.reducer;
