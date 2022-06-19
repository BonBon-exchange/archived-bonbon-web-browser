/* eslint-disable @typescript-eslint/ban-ts-comment */
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

import boardReducer from './reducers/Board';

// @ts-ignore
export const store = configureStore({
  reducer: {
    board: boardReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// @ts-ignore
export const getPersistedStoreAndPersistor = (id: string) => {
  const persistConfig = {
    key: id,
    version: 1,
    storage,
  };
  const persistedBoard = persistReducer(persistConfig, boardReducer);
  const persistedStore = configureStore({
    reducer: {
      board: persistedBoard,
    },
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });
  const persistor = persistStore(persistedStore);

  return { persistor, store: persistedStore };
};
