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

export const store = configureStore({
  reducer: {
    addaps: addapsReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const getPersistedStoreAndPersistor = (id: string) => {
  const persistConfig = {
    key: id,
    version: 1,
    storage,
  };
  const persistedAddaps = persistReducer(persistConfig, addapsReducer);
  const persistedStore = configureStore({
    reducer: {
      addaps: persistedAddaps,
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
