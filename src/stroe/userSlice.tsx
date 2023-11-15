import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
        setProfile: (state, action: PayloadAction<LoginState>) =>
            action.payload,
        setLogout: (state) =>
            initialState
    },
});

export const { setProfile, setLogout } = userSlice.actions;
export default userSlice.reducer;