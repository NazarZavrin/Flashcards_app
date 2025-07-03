import { configureStore } from "@reduxjs/toolkit";
import messageReducer from './App/messageSlice';
import loginFormReducer from './Auth/loginFormSlice';
import createAccountFormReducer from './Auth/createAccountFormSlice';
import userReducer from './Auth/userSlice';
import { useDispatch, useSelector } from "react-redux";

export const store = configureStore({
    reducer: {
        // app: appReducer,
        message: messageReducer,
        loginForm: loginFormReducer,
        createAccountForm: createAccountFormReducer,
        user: userReducer,
    }
})

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector = useSelector.withTypes<AppState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();