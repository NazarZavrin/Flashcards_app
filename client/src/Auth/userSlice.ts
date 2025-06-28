import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { serverRequest } from "../utils/serverRequest";

export interface IUserData {
    name: string;
    email: string;
    password: string;
}
export type UserDataForLogin = Pick<IUserData, 'email' | 'password'>

type UserDataToStore = Partial<Pick<IUserData, 'name' | 'email'>> & {
    isLoading: boolean;
}
const initialState: UserDataToStore = {
    name: undefined,
    email: undefined,
    isLoading: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createAccount.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(createAccount.fulfilled, (state, action) => {
                const response = action.payload;
                const result = response.result;
                if (response.ok) {
                    state.name = result.name;
                    state.email = result.email;
                    localStorage.setItem('accessToken', result.accessToken);
                }
                state.isLoading = false;
            }).addCase(createAccount.rejected, (state, action) => {
                state.isLoading = false;
            }).addCase(logIn.pending, (state, action) => {
                state.isLoading = true;
            }).addCase(logIn.fulfilled, (state, action) => {
                const response = action.payload;
                const result = response.result;
                if (response.ok) {
                    state.name = result.name;
                    state.email = result.email;
                    localStorage.setItem('accessToken', result.accessToken);
                }
                state.isLoading = false;
            }).addCase(logIn.rejected, (state, action) => {
                state.isLoading = false;
            });
    },
})

export const createAccount = createAsyncThunk(
    'user/createAccount',
    async (userData: IUserData) => {
        const response = await serverRequest('/users/create-account', {
            method: 'POST',
            body: JSON.stringify(userData),
        })
        // throw new Error('rejection test');
        return response;
    }
)
export const logIn = createAsyncThunk(
    'user/logIn',
    async (userDataForLogin: UserDataForLogin) => {
        const response = await serverRequest('/users/login', {
            method: 'PROPFIND',
            body: JSON.stringify(userDataForLogin),
        })
        return response;
    }
)

export default userSlice.reducer;