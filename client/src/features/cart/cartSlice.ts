import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';
import {
  clearCart,
  createOrUpdateCart,
  getCartByUserId,
  mergeCart,
  removeItemFromCart,
} from '../../api/cart';
import { ApiResponse, Cart } from '../../types/type';

interface CartState {
  loading: boolean;
  cart: Cart | null;
  error: string | null;
}

const initialState: CartState = {
  loading: false,
  cart: JSON.parse(localStorage.getItem('cart') || 'null'),
  error: null,
};

export const fetchCart = createAsyncThunk<Cart | null, string | undefined>(
  'cart/fetchCart',
  async (userId, { rejectWithValue }) => {
    try {
      // Check if userId exists (user is logged in)
      if (userId) {
        const response: ApiResponse<Cart> = await getCartByUserId(userId);
        return response.cart || null;
      } else {
        // If not logged in, return the cart from localStorage
        const localCart = JSON.parse(localStorage.getItem('cart') || 'null');
        return localCart;
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message); // Show toast message for error
        return rejectWithValue(error.message);
      } else {
        toast.error('An unknown error occurred'); // Handle unknown errors
        return rejectWithValue('An unknown error occurred');
      }
    }
  }
);

export const addOrUpdateCart = createAsyncThunk<
  Cart | null,
  { userId?: string; productId: string; quantity: number; price: number }
>(
  'cart/addOrUpdateCart',
  async ({ userId, productId, quantity, price }, { rejectWithValue }) => {
    try {
      if (userId) {
        // If user is logged in, update the backend cart
        const response: ApiResponse<Cart> = await createOrUpdateCart(
          userId,
          productId,
          quantity
        );
        toast.success('Cart updated successfully!');
        return response.cart || null;
      } else {
        // Handle updating cart in localStorage for guests
        const localCart: Cart = JSON.parse(
          localStorage.getItem('cart') || 'null'
        ) || { items: [] };

        // Find the item to update or add a new one
        const existingItem = localCart.items.find(
          (item) =>
            typeof item.product === 'string' && item.product === productId
        );
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          localCart.items.push({ product: productId, quantity, price });
        }

        localStorage.setItem('cart', JSON.stringify(localCart));
        toast.success('Cart updated successfully!');
        return localCart;
      }
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

export const removeCartItem = createAsyncThunk<
  Cart | null,
  { userId: string; productId: string }
>('cart/removeCartItem', async ({ userId, productId }, { rejectWithValue }) => {
  try {
    const response: ApiResponse<Cart> = await removeItemFromCart(
      userId,
      productId
    );
    toast.success('Item removed from cart!');
    return response.cart || null;
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    } else {
      toast.error('An unknown error occurred');
      return rejectWithValue('An unknown error occurred');
    }
  }
});

export const clearUserCart = createAsyncThunk<
  ApiResponse<{ message: string }>,
  string
>('cart/clearUserCart', async (userId, { rejectWithValue }) => {
  try {
    const response = await clearCart(userId);
    toast.success('Cart cleared successfully!');
    return response;
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    } else {
      toast.error('An unknown error occurred');
      return rejectWithValue('An unknown error occurred');
    }
  }
});

export const mergeGuestCart = createAsyncThunk<
  Cart | null,
  { guestCart: Cart['items']; userId: string }
>('cart/mergeGuestCart', async ({ guestCart, userId }, { rejectWithValue }) => {
  try {
    const response: ApiResponse<Cart> = await mergeCart(guestCart, userId);
    // toast.success('Cart merged successfully!');
    return response.cart || null;
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    } else {
      toast.error('An unknown error occurred');
      return rejectWithValue('An unknown error occurred');
    }
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.cart = action.payload; // Set the cart from local storage
    },
    resetCart: (state) => {
      state.cart = null; // This is now valid since cart is Cart | null
      state.error = null;
      state.loading = false;
    },
    setLocalCart: (state, action: PayloadAction<Cart>) => {
      state.cart = action.payload; // Update cart with local data
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addOrUpdateCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(clearUserCart.fulfilled, (state) => {
        state.cart = null;
      })
      .addCase(mergeGuestCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(mergeGuestCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetCart, setLocalCart } = cartSlice.actions;
export default cartSlice.reducer;
