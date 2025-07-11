import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { serverRequest } from "../utils/serverRequest";
import { IUserData, UserDataForLogin } from "./AuthForm";

type UserDataToStore = Partial<Pick<IUserData, 'name' | 'email'>>
const initialState: UserDataToStore & { isAuthenticated: boolean } = {
    name: undefined,
    email: undefined,
    isAuthenticated: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserData: (state, action: { payload: UserDataToStore }) => {
            const { name, email } = action.payload;
            if (name) state.name = name;
            if (email) state.email = email;
        },
        setIsAuthenticated: (state, action: { payload: boolean }) => {
            state.isAuthenticated = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(logIn.pending, (state, action) => { })
            .addCase(logIn.fulfilled, (state, action) => { })
            .addCase(logIn.rejected, (state, action) => { })
            .addCase(createAccount.pending, (state, action) => { })
            .addCase(createAccount.fulfilled, (state, action) => { })
            .addCase(createAccount.rejected, (state, action) => { })
            .addMatcher(logIn.settled, (state, action) => {
                // This matcher will be called for both fulfilled and rejected actions
            }).addMatcher(createAccount.settled, (state, action) => {
                // This matcher will be called for both fulfilled and rejected actions
            });
    }
})

export const createAccount = createAsyncThunk(
    'user/createAccount',
    async (userData: IUserData) => {
        const response = await serverRequest('/users/create-account', {
            method: 'POST',
            body: JSON.stringify(userData),
        })
        // throw new Error('createAccount: rejection test');
        return response;
    }
);

export const logIn = createAsyncThunk(
    'user/logIn',
    async (userDataForLogin: UserDataForLogin) => {
        const response = await serverRequest('/users/login', {
            method: 'PROPFIND',
            body: JSON.stringify(userDataForLogin),
        })
        // throw new Error('logIn: rejection test');
        return response;
    }
)

export const { setUserData, setIsAuthenticated } = userSlice.actions;

export default userSlice.reducer;