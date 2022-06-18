/* eslint-disable import/prefer-default-export */
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { TopBar } from 'renderer/components/TopBar';
import { store, persistor } from 'renderer/store/store';

import './style.scss';
import 'renderer/style/dark.css';
import 'renderer/style/light.css';

export const TitleBar: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div id="TitleBar__container">
          <TopBar setShowLibrary={() => true} />
        </div>
      </PersistGate>
    </Provider>
  );
};
