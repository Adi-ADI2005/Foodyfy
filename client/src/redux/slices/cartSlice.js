import { createSlice } from '@reduxjs/toolkit';

const savedCart = JSON.parse(localStorage.getItem('foodyfy_cart') || '[]');

const saveCart = (items) => {
  localStorage.setItem('foodyfy_cart', JSON.stringify(items));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: savedCart,
    coupon: null,
    discount: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const { food, quantity = 1, addons = [] } = action.payload;
      const existing = state.items.find(i => i._id === food._id && JSON.stringify(i.addons) === JSON.stringify(addons));
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({
          _id: food._id,
          name: food.name,
          price: food.discountPrice > 0 ? food.discountPrice : food.price,
          image: food.images?.[0] || '',
          quantity,
          addons,
        });
      }
      saveCart(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i._id !== action.payload);
      saveCart(state.items);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(i => i._id === id);
      if (item) {
        item.quantity = quantity;
        if (quantity <= 0) {
          state.items = state.items.filter(i => i._id !== id);
        }
      }
      saveCart(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      state.coupon = null;
      state.discount = 0;
      localStorage.removeItem('foodyfy_cart');
    },
    applyCoupon: (state, action) => {
      state.coupon = action.payload.coupon;
      state.discount = action.payload.discount;
    },
    removeCoupon: (state) => {
      state.coupon = null;
      state.discount = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, applyCoupon, removeCoupon } = cartSlice.actions;
export default cartSlice.reducer;
