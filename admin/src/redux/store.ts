import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import darkModeReducer from "./darkModeSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    darkMode: darkModeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
