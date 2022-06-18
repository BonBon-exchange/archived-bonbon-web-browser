/* eslint-disable import/prefer-default-export */
import { Provider } from 'react-redux';

import { Addaps } from './components/Addaps';
import { store } from './store/store';

import './App.css';

export function App() {
  return (
    <Provider store={store}>
      <Addaps />
    </Provider>
  );
}
