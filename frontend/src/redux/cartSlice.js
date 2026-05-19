import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const quantity = Number(product.quantity) || 1;
      const stock = Number(product.stock) || quantity;
      const existingItem = state.cartItems.find((item) => item._id === product._id);

      if (existingItem) {
        existingItem.quantity = Math.min(
          (Number(existingItem.quantity) || 1) + quantity,
          stock
        );
      } else {
        state.cartItems.push({
          ...product,
          quantity: Math.min(quantity, stock),
        });
      }
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload
      );
    },
    updateCartQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find((cartItem) => cartItem._id === id);

      if (item) {
        const stock = Number(item.stock) || Number(quantity) || 1;
        item.quantity = Math.min(Math.max(Number(quantity) || 1, 1), stock);
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const { addToCart, removeFromCart, updateCartQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
