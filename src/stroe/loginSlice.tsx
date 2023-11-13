import { createSlice } from "@reduxjs/toolkit";

const isShowModal: boolean = false;

const initialState = {
    isShowModal: false
};

const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        toggleLoginModal: (state) => {
            state.isShowModal = !state.isShowModal;
        },
    },
});

export const { toggleLoginModal } = loginSlice.actions;
export default loginSlice.reducer;