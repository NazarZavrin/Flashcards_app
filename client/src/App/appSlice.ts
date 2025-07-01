import { createSlice } from '@reduxjs/toolkit';

export type MessageInfo = {
    text: string,
    type?: 'success' | 'error' | 'warning' | 'info',
    displayDuration?: number,
}

export const defaultDisplayDuration: number = 2500;

const initialState: { messages: MessageInfo[], messageMustBeDisplayed: boolean } = {
    messages: [],
    messageMustBeDisplayed: false
}

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        showMessage: (state, action: { payload: MessageInfo }) => {
            state.messages.push(action.payload);
            if (state.messages.length === 1) {
                state.messageMustBeDisplayed = true;
            }
        },
        setMessageMustBeDisplayed: (state, action: {payload: boolean}) => {
            state.messageMustBeDisplayed = action.payload;
        },
        showNextMessage: (state) => {
            if (state.messages.length > 0) {
                state.messages.shift();
            }
            if (state.messages.length > 0) {
                state.messageMustBeDisplayed = true;
            }
        }
    },
})

export const { showMessage, setMessageMustBeDisplayed, showNextMessage } = appSlice.actions;

export default appSlice.reducer;