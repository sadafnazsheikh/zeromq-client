import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import messagesReducer from '../features/messages/messagesSlice';

export const store = configureStore({
  reducer: {
    messages: messagesReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
