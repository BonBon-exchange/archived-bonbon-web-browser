import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import addapsReducer from './reducers/Addaps';
import tabsReducer from './reducers/Tabs';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

const persistedAddaps = persistReducer(persistConfig, addapsReducer);

export const store = configureStore({
  reducer: {
    addaps: persistedAddaps,
    tabs: tabsReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
