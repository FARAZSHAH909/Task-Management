import { configureStore } from '@reduxjs/toolkit';
import userReducers from './reducers';

export const store = configureStore({
    reducer: {
        user: userReducers,
    },
});
