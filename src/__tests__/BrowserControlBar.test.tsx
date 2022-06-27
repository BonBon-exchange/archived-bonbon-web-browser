/* eslint-disable react/jsx-props-no-spreading */
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Middleware } from '@reduxjs/toolkit';

import { BrowserControlBar } from '../renderer/App/components/BrowserControlBar';
import { mockWindow } from './beforeAll';
import { initialState } from '../renderer/App/store/reducers/Board';

let store: any;
const middlewares: Middleware[] = [];

const browserControlBarProps = {
  goBack: jest.fn(),
  goForward: jest.fn(),
  reload: jest.fn(),
  url: 'https://www.github.com',
  browserId: '123abc',
  goHome: jest.fn(),
};

describe('BrowserControlBar', () => {
  beforeAll(() => {
    mockWindow();
    const mockStore = configureStore(middlewares);
    store = mockStore({ board: initialState });
  });

  it('should render', () => {
    expect(
      render(
        <Provider store={store}>
          <BrowserControlBar {...browserControlBarProps} />
        </Provider>
      )
    ).toBeTruthy();
  });
});
