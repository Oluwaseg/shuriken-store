import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';
import {
  getUserDetails,
  updateProfile,
  updateUserPassword,
} from '../../api/user';
import { ErrorResponse, User } from '../../types/type';
import { updateAuthUserInfo } from '../auth/authSlice';

interface UserState {
  loading: boolean;
  userInfo: User | null;
  error: string | null;
}

const initialState: UserState = {
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
  error: null,
};

// Get User Details
export const fetchUserDetails = createAsyncThunk(
  'user/getUserDetails',
  async (_, { rejectWithValue }) => {
    try {
      const user = await getUserDetails();
      return user;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        return rejectWithValue(error.message);
      } else {
        toast.error('An unknown error occurred');
        return rejectWithValue('An unknown error occurred');
      }
    }
  }
);

// Update User Profile
export const fetchUpdateProfile = createAsyncThunk(
  'user/updateProfile',
  async (formData: FormData, { rejectWithValue, dispatch }) => {
    try {
      const user = await updateProfile(formData);
      toast.success('Profile updated successfully!');

      dispatch(updateAuthUserInfo(user));
      return user;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        return rejectWithValue(error.message);
      } else {
        toast.error('An unknown error occurred');
        return rejectWithValue('An unknown error occurred');
      }
    }
  }
);

// Update User Password
export const fetchUpdateUserPassword = createAsyncThunk(
  'user/updateUserPassword',
  async (
    passwordData: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const message = await updateUserPassword(passwordData);
      toast.success(message);
      return message;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        return rejectWithValue(error.message);
      } else {
        toast.error('An unknown error occurred');
        return rejectWithValue('An unknown error occurred');
      }
    }
  }
);

// User Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUserState: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        localStorage.setItem('userInfo', JSON.stringify(action.payload));
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as ErrorResponse)?.message || 'An error occurred';
      })
      .addCase(fetchUpdateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUpdateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
        localStorage.setItem('userInfo', JSON.stringify(action.payload));
      })
      .addCase(fetchUpdateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as ErrorResponse)?.message || 'An error occurred';
      })
      .addCase(fetchUpdateUserPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUpdateUserPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchUpdateUserPassword.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as ErrorResponse)?.message || 'An error occurred';
      });
  },
});

export const { resetUserState } = userSlice.actions;
export default userSlice.reducer;
