import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import userSlice from '@/store/userSlice';
import loginSlice from '@/store/loginSlice';
import cartSlice from '@/store/cartSlice';

const store = configureStore({
  reducer: {
    user: userSlice,
    loginModal: loginSlice,
    cart: cartSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
