/* eslint-disable import/prefer-default-export */
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { Addaps } from './components/Addaps';
import { store, persistor } from './store/store';

export function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Addaps />
      </PersistGate>
    </Provider>
  );
}
