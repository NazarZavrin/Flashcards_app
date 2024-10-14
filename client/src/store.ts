import { configureStore } from "@reduxjs/toolkit";
import appReducer from './App/appSlice'
import userReducer from './Auth/userSlice';
import { useDispatch, useSelector } from "react-redux";

export const store = configureStore({
    reducer: {
        app: appReducer,
        user: userReducer
    }
})

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector = useSelector.withTypes<AppState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();