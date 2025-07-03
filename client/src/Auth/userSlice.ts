import { createSlice } from "@reduxjs/toolkit";
import { IUserData } from "./createAccountFormSlice";

type UserDataToStore = Partial<Pick<IUserData, 'name' | 'email'>>
const initialState: UserDataToStore = {
    name: undefined,
    email: undefined,
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
    },
})

export const { setUserData } = userSlice.actions;

export default userSlice.reducer;