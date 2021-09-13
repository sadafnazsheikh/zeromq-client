import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

const MAX_MESSAGES = 30;

export interface MessageData {
    timestamp: number;
    lat: number;
    lon: number;
    information?: string;
}

// sorts according to timestamp
function compareMessages(messageA: MessageData, messageB: MessageData) {
    return messageA.timestamp - messageB.timestamp;
}


export interface MessagesState {
    messages: MessageData[];
}

const initialState: MessagesState = {
    messages: []
};

export const messagesSlice = createSlice({
    name: 'messages',
    initialState,

    reducers: {
        // reducer to add a new message
        addMessage: (state, action: PayloadAction<MessageData>) => {
            // add to the current messages
            state.messages.push(action.payload);
            // sort according to timestamp and keep only the last 30 values
            state.messages = state.messages.sort(compareMessages).slice(-MAX_MESSAGES);
            console.log('Messages', state.messages.length);
        }
    },
});

export const { addMessage } = messagesSlice.actions;

export const selectMessages = (state: RootState) => state.messages.messages;

export default messagesSlice.reducer;
