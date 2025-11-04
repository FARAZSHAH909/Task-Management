import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoggedIn: localStorage.getItem('ProjectVistaIsLoggedInAdmin') || null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            // state.user = action.payload;
            state.isLoggedIn = true;


            localStorage.setItem("ProjectVistaIsLoggedInAdmin", "true")

        },
        logout: (state) => {
            state.isLoggedIn = false;


            localStorage.removeItem("ProjectVistaIsLoggedInAdmin")
        },
    },
});

export const { login, logout } = userSlice.actions;
const userReducers = userSlice.reducer
export default userReducers;
