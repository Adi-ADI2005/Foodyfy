import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import foodReducer from './slices/foodSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    food: foodReducer,
  },
});

export default store;
