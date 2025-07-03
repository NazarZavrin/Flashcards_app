import { createSlice } from '@reduxjs/toolkit';

export type MessageInfo = {
    text: string,
    type?: 'success' | 'error' | 'warning' | 'info',
    displayDuration?: number,
}

export const defaultDisplayDuration: number = 2500;

const initialState: { queue: MessageInfo[], mustBeDisplayed: boolean } = {
    queue: [],
    mustBeDisplayed: false
}

const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        showMessage: (state, action: { payload: MessageInfo }) => {
            state.queue.push(action.payload);
            if (state.queue.length === 1) {
                state.mustBeDisplayed = true;
            }
        },
        setMessageMustBeDisplayed: (state, action: {payload: boolean}) => {
            state.mustBeDisplayed = action.payload;
        },
        showNextMessage: (state) => {
            if (state.queue.length > 0) {
                state.queue.shift();
            }
            if (state.queue.length > 0) {
                state.mustBeDisplayed = true;
            }
        }
    },
})

export const { showMessage, setMessageMustBeDisplayed, showNextMessage } = messageSlice.actions;

export default messageSlice.reducer;