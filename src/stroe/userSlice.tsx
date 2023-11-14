import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stat } from "fs";
import { act } from "react-dom/test-utils";

export interface LoginState {
    name: string,
    email: string,
    flag: boolean,
};

const initialState: LoginState = {
    name: "",
    email: "",
    flag: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setProfile: (state, action: PayloadAction<LoginState>) => {
            // 沒用
            state = action.payload;
            return action.payload;
        },
        setLogout: (state) => {
            state = initialState
        }
    },
});

export const { setProfile, setLogout } = userSlice.actions;
export default userSlice.reducer;