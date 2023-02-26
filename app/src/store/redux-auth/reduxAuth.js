import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
    user: null,
}

export const authSlice = createSlice({
    name: "auth",
    initialState: initialAuthState,
    reducers: {
        login(state, action) {
            state.user = action.payload
        }
    }
})

export const authActions = authSlice.actions;
