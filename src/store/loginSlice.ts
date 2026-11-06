import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AuthMode = 'login' | 'register';

export interface LoginModalState {
  isOpen: boolean;
  mode: AuthMode;
  notice: string;
}

const initialState: LoginModalState = {
  isOpen: false,
  mode: 'login',
  notice: '',
};

const loginSlice = createSlice({
  name: 'loginModal',
  initialState,
  reducers: {
    openLoginModal: (state, action: PayloadAction<string | undefined>) => {
      state.isOpen = true;
      state.mode = 'login';
      state.notice = action.payload ?? '';
    },
    closeLoginModal: (state) => {
      state.isOpen = false;
      state.notice = '';
    },
    switchAuthMode: (state, action: PayloadAction<AuthMode>) => {
      state.mode = action.payload;
      state.notice = '';
    },
    setAuthNotice: (state, action: PayloadAction<string>) => {
      state.notice = action.payload;
    },
  },
});

export const { openLoginModal, closeLoginModal, switchAuthMode, setAuthNotice } = loginSlice.actions;
export default loginSlice.reducer;
