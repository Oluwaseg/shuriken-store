import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getMyOrders, getSingleOrder } from '../../api/order';
import { Order } from '../../types/type';

interface OrderState {
  orders: Order[] | null;
  singleOrder: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: null,
  singleOrder: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchSingleOrder = createAsyncThunk(
  'orders/fetchSingleOrder',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await getSingleOrder(orderId);
      return response.orders;
    } catch (error: unknown) {
      // Narrow down the type of error
      if (error instanceof Error) {
        // For generic errors
        return rejectWithValue(error.message);
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error
      ) {
        // For Axios or similar library errors
        const err = error as { response?: { data?: { message: string } } };
        return rejectWithValue(
          err.response?.data?.message || 'An unknown error occurred'
        );
      } else {
        // For unexpected cases
        return rejectWithValue('An unknown error occurred');
      }
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMyOrders();
      return response.orders;
    } catch (error: unknown) {
      // Narrow down the type of error
      if (error instanceof Error) {
        // For generic errors
        return rejectWithValue(error.message);
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error
      ) {
        // For Axios or similar library errors
        const err = error as { response?: { data?: { message: string } } };
        return rejectWithValue(
          err.response?.data?.message || 'An unknown error occurred'
        );
      } else {
        // For unexpected cases
        return rejectWithValue('An unknown error occurred');
      }
    }
  }
);

// Slice
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearSingleOrder: (state) => {
      state.singleOrder = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Single Order
    builder
      .addCase(fetchSingleOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.singleOrder = action.payload ?? null;
      })
      .addCase(fetchSingleOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch My Orders
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload ?? null;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSingleOrder } = orderSlice.actions;

export default orderSlice.reducer;
