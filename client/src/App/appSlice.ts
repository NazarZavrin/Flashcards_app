import { createSlice } from '@reduxjs/toolkit'

export type MessageInfo = {
    text: string,
    type?: 'success' | 'error' | 'warning' | 'info',
    displayDuration?: number, // showTime
    // mustBeDisplayed: boolean
}

const initialState: MessageInfo & { mustBeDisplayed: boolean, timeoutId: ReturnType<typeof setTimeout> | null} = {
    text: '',
    mustBeDisplayed: false,
    timeoutId: null
}

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        showMessage: (state, action: { payload: MessageInfo }) => {
            /*if (state.timeoutId !== null) {
                clearTimeout(state.timeoutId)
            }*/
            state = { ...action.payload, mustBeDisplayed: true, timeoutId: null };
            return state;
        },
        /*scheduleHiding: (state) => {
            /*setTimeout(() => {
                state.mustBeDisplayed = false;
                console.log('timeout');
            }, state.displayDuration ?? 1000);// 3000
        },*/
        /*setMessage: (state, action) => {
            state.text = action.payload;
            console.log("message is changed");
        },*/
        setMustBeDisplayed: (state, action) => {
            state.mustBeDisplayed = action.payload;
        },
        hideMessage: (state) => {
            // state.text = '';
            state.mustBeDisplayed = false;
        },
    },
})

export const { showMessage, setMustBeDisplayed, hideMessage } = appSlice.actions;

export default appSlice.reducer;