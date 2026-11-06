import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addToCart, getCart, removeFromCart, setCartQuantity } from '@/lib/services/cart';
import { ApiFailure, toFailure } from '@/lib/api';
import { Cart } from '@/lib/types';
import { login, logout, restoreSession, sessionExpired } from '@/store/userSlice';

export interface CartState extends Cart {
  loading: boolean;
}

const emptyCart: Cart = { items: [], total: 0 };

const initialState: CartState = { ...emptyCart, loading: false };

type Thunk = { rejectValue: ApiFailure };

const mutate = async (action: () => Promise<unknown>, rejectWithValue: (value: ApiFailure) => unknown) => {
  try {
    await action();
    return getCart();
  } catch (err) {
    throw rejectWithValue(toFailure(err));
  }
};

export const fetchCart = createAsyncThunk('cart/fetch', () => getCart());

export const addItem = createAsyncThunk<Cart, { productId: number; num: number }, Thunk>(
  'cart/add',
  ({ productId, num }, { rejectWithValue }) => mutate(() => addToCart(productId, num), rejectWithValue),
);

export const changeQuantity = createAsyncThunk<Cart, { productId: number; num: number }, Thunk>(
  'cart/changeQuantity',
  ({ productId, num }, { rejectWithValue }) => mutate(() => setCartQuantity(productId, num), rejectWithValue),
);

export const removeItem = createAsyncThunk<Cart, number, Thunk>('cart/remove', (productId, { rejectWithValue }) =>
  mutate(() => removeFromCart(productId), rejectWithValue),
);

const replaceCart = (state: CartState, action: PayloadAction<Cart>): CartState => ({
  ...action.payload,
  loading: false,
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, replaceCart)
      .addCase(fetchCart.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addItem.fulfilled, replaceCart)
      .addCase(changeQuantity.fulfilled, replaceCart)
      .addCase(removeItem.fulfilled, replaceCart)
      .addCase(logout.fulfilled, () => initialState)
      .addCase(logout.rejected, () => initialState)
      .addCase(sessionExpired, () => initialState)
      .addCase(restoreSession.fulfilled, (state, action) =>
        action.payload.status === 'member' ? state : initialState,
      )
      .addCase(login.fulfilled, () => initialState);
  },
});

export const { clearCart } = cartSlice.actions;
export const cartCount = (state: CartState): number => state.items.reduce((sum, item) => sum + item.num, 0);
export default cartSlice.reducer;
