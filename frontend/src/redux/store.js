import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

const loadCartState = () => {
  try {
    const serializedState = localStorage.getItem('cartState');
    if (!serializedState) return undefined;
    return JSON.parse(serializedState);
  } catch (error) {
    console.error('Failed to load cart state from localStorage', error);
    return undefined;
  }
};

const saveCartState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('cartState', serializedState);
  } catch (error) {
    console.error('Failed to save cart state to localStorage', error);
  }
};

const persistedState = loadCartState();

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  preloadedState: persistedState ? { cart: persistedState } : undefined,
});

store.subscribe(() => {
  saveCartState(store.getState().cart);
});

export default store;