// store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import checkoutReducer from '../features/checkout/checkoutSlice';
import orderReducer from '../features/orders/orderSlice';
import productReducer from '../features/product/productSlice';
import themeReducer from '../features/themes/themeSlice';
import userReducer from '../features/user/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    product: productReducer,
    cart: cartReducer,
    user: userReducer,
    checkout: checkoutReducer,
    order: orderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
