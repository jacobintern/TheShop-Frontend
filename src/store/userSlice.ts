import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApiFailure, toFailure, tokenStorage } from '@/lib/api';
import { getProfile, login as loginApi, logout as logoutApi } from '@/lib/services/user';
import { LoginInfo } from '@/lib/types';

export type AuthStatus = 'unknown' | 'guest' | 'member';

export interface UserState {
  status: AuthStatus;
  accountId: number;
  account: string;
  name: string;
}

const guest: UserState = { status: 'guest', accountId: 0, account: '', name: '' };

const initialState: UserState = { ...guest, status: 'unknown' };

// 頁面載入時用 localStorage 的 token 換回身分；token 失效就清掉
export const restoreSession = createAsyncThunk('user/restore', async (): Promise<UserState> => {
  if (!tokenStorage.get()) return guest;
  try {
    const profile = await getProfile();
    return { status: 'member', accountId: profile.accID, account: profile.acc, name: profile.name };
  } catch {
    tokenStorage.clear();
    return guest;
  }
});

export const login = createAsyncThunk<LoginInfo, { acc: string; pswd: string }, { rejectValue: ApiFailure }>(
  'user/login',
  async ({ acc, pswd }, { rejectWithValue }) => {
    try {
      const info = await loginApi(acc, pswd);
      tokenStorage.set(info.token);
      return info;
    } catch (err) {
      return rejectWithValue(toFailure(err));
    }
  },
);

export const logout = createAsyncThunk('user/logout', async () => {
  try {
    await logoutApi();
  } finally {
    tokenStorage.clear();
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    sessionExpired: () => {
      tokenStorage.clear();
      return guest;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.fulfilled, (_, action: PayloadAction<UserState>) => action.payload)
      .addCase(login.fulfilled, (_, action: PayloadAction<LoginInfo>) => ({
        status: 'member',
        accountId: action.payload.accountId,
        account: action.payload.account,
        name: action.payload.name,
      }))
      .addCase(logout.fulfilled, () => guest)
      .addCase(logout.rejected, () => guest);
  },
});

export const { sessionExpired } = userSlice.actions;
export const isMember = (state: UserState): boolean => state.status === 'member';
export default userSlice.reducer;
