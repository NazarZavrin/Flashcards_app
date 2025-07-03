import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { serverRequest } from "../utils/serverRequest";

export interface IUserData {
    name: string;
    email: string;
    password: string;
}
const initialState: {
    inputs: IUserData;
    isLoading: boolean;
} = {
    inputs: {
        name: 'Ann',
        email: 'ann@gmail.com',
        password: 'annp',
    },
    isLoading: false,
}

const createAccountFormSlice = createSlice({
    name: 'createAccountForm',
    initialState,
    reducers: {
        setCreateAccountFormInputs: (state, action: { payload: IUserData }) => {
            const { name, email, password } = action.payload;
            state.inputs.name = name;
            state.inputs.email = email;
            state.inputs.password = password;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createAccount.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(createAccount.fulfilled, (state, action) => { })
            .addCase(createAccount.rejected, (state, action) => { })
            .addMatcher(createAccount.settled, (state, action) => {
                // This matcher will be called for both fulfilled and rejected actions
                state.isLoading = false;
            });
    }
})

export const createAccount = createAsyncThunk(
    'createAccountFormInput/createAccount',
    async (userData: IUserData) => {
        const response = await serverRequest('/users/create-account', {
            method: 'POST',
            body: JSON.stringify(userData),
        })
        // throw new Error('createAccount: rejection test');
        return response;
    }
)

export const { setCreateAccountFormInputs } = createAccountFormSlice.actions;

export default createAccountFormSlice.reducer;