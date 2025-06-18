import { createSlice } from '@reduxjs/toolkit'

export type MessageInfo = {
    text: string,
    type?: 'success' | 'error' | 'warning' | 'info',
    displayDuration?: number,
    // mustBeDisplayed: boolean
}
export const defaultDisplayDuration: number = 3000;

const initialState: MessageInfo & { mustBeDisplayed: boolean } = {
    text: '',
    mustBeDisplayed: false
}


const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        showMessage: (state, action: { payload: MessageInfo }) => {
            state = { ...action.payload, mustBeDisplayed: true };
            return state;
        },
        hideMessage: (state) => {
            state.mustBeDisplayed = false;
        },
    },
})

export const { showMessage, hideMessage } = appSlice.actions;

export default appSlice.reducer;