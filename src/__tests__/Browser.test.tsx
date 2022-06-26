/* eslint-disable react/jsx-props-no-spreading */
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Middleware } from '@reduxjs/toolkit';

import { Browser } from '../renderer/App/components/Browser';
import { mockWindow } from './beforeAll';
import { initialState } from '../renderer/App/store/reducers/Board';

let store: any;
const middlewares: Middleware[] = [];

const browserProps = {
  id: '123qsdf',
  url: 'https://www.github.com',
  top: 0,
  left: 0,
  height: 600,
  width: 800,
  firstRendering: true,
};

describe('Browser', () => {
  beforeAll(() => {
    mockWindow();
    const mockStore = configureStore(middlewares);
    store = mockStore({ board: initialState });
  });

  it('should render', () => {
    expect(
      render(
        <Provider store={store}>
          <Browser {...browserProps} />
        </Provider>
      )
    ).toBeTruthy();
  });
});
