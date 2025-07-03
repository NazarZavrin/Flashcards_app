import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IUserData } from "./createAccountFormSlice";
import { serverRequest } from "../utils/serverRequest";

export type UserDataForLogin = Pick<IUserData, 'email' | 'password'>
const initialState: {
    inputs: UserDataForLogin;
    isLoading: boolean;
} = {
    inputs: {
        email: 'ann@gmail.com',
        password: 'annp',
    },
    isLoading: false,
}

const loginFormSlice = createSlice({
    name: 'loginForm',
    initialState,
    reducers: {
        setLoginFormInputs: (state, action: { payload: UserDataForLogin }) => {
            const { email, password } = action.payload;
            state.inputs.email = email;
            state.inputs.password = password;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(logIn.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(logIn.fulfilled, (state, action) => { })
            .addCase(logIn.rejected, (state, action) => { })
            .addMatcher(logIn.settled, (state, action) => {
                // This matcher will be called for both fulfilled and rejected actions
                state.isLoading = false;
            });
    }
})

export const logIn = createAsyncThunk(
    'loginFormInput/logIn',
    async (userDataForLogin: UserDataForLogin) => {
        const response = await serverRequest('/users/login', {
            method: 'PROPFIND',
            body: JSON.stringify(userDataForLogin),
        })
        // throw new Error('logIn: rejection test');
        return response;
    }
)

export const { setLoginFormInputs } = loginFormSlice.actions;

export default loginFormSlice.reducer;