import userSlice from '@/stroe/userSlice';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
    reducer: {
        // key : value
        user: userSlice
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;