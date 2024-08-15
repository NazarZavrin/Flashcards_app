import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IUserData } from "./CreateAccountForm"
import { serverRequest } from "../utils/serverRequest";

type UserDataToStore = Partial<Pick<IUserData, 'name' | 'email'>> & {
    isLoading: boolean;
}
const initialState: UserDataToStore = {
    isLoading: false,
};

export const userSlice = createSlice({
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
                    alert('Account has been created');
                } else {
                    const message: string = result.message;
                    if (message.includes('email already exists')) {
                        alert(message);
                    } else {
                        console.error(message);
                        alert('Server error.');
                    }
                }
                state.isLoading = false;
            })
    },
})

export const createAccount = createAsyncThunk(
    'user/createAccount',
    async (userData: IUserData) => {
        const response = await serverRequest('/users/create-account', {
            method: 'POST',
            body: JSON.stringify(userData),
        })
        return response;
    }
)

export default userSlice.reducer;