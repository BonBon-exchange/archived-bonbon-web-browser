import { configureStore } from '@reduxjs/toolkit';

import addapsReducer from './reducers/Addaps';


export const store = configureStore({
  reducer: {
    addaps: addapsReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
