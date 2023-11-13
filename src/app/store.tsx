import userSlice from '@/stroe/userSlice';
import loginSlice from '@/stroe/loginSlice';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
    reducer: {
        // key : value
        user: userSlice,
        isShow: loginSlice,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;