import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';
import { initializeCheckout as initializeCheckoutAPI } from '../../api/checkout';
import { ApiResponse, CheckoutData, ShippingInfo } from '../../types/type';

interface CheckoutState {
  loading: boolean;
  checkoutData: CheckoutData | null;
  error: string | null;
}

const initialState: CheckoutState = {
  loading: false,
  checkoutData: null,
  error: null,
};

// Async thunk to initialize checkout
export const initializeCheckout = createAsyncThunk<
  CheckoutData,
  { userId: string; shippingInfo: ShippingInfo },
  { rejectValue: string }
>(
  'checkout/initialize',
  async ({ userId, shippingInfo }, { rejectWithValue }) => {
    try {
      // Call the API function
      const response: ApiResponse<CheckoutData> = await initializeCheckoutAPI(
        userId,
        shippingInfo
      );

      if (!response.success) {
        throw new Error(response.message || 'Failed to initialize checkout');
      }

      toast.success('Checkout initialized successfully!');
      return response.data!;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        return rejectWithValue(error.message);
      }
      toast.error('An unknown error occurred');
      return rejectWithValue('An unknown error occurred');
    }
  }
);

// Checkout Slice
const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    resetCheckoutState: (state) => {
      state.checkoutData = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.checkoutData = action.payload;
        state.error = null;
      })
      .addCase(initializeCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred during checkout';
      });
  },
});

export const { resetCheckoutState } = checkoutSlice.actions;
export default checkoutSlice.reducer;
