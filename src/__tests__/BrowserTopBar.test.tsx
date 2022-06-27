/* eslint-disable react/jsx-props-no-spreading */
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Middleware } from '@reduxjs/toolkit';

import { BrowserTopBar } from '../renderer/App/components/BrowserTopBar';
import { mockWindow } from './beforeAll';
import { initialState } from '../renderer/App/store/reducers/Board';

let store: any;
const middlewares: Middleware[] = [];

const browserTopBarProps = {
  closeBrowser: jest.fn(),
  toggleFullsizeBrowser: jest.fn(),
  title: 'Github',
  onClick: jest.fn(),
};

describe('BrowserTopBar', () => {
  beforeAll(() => {
    mockWindow();
    const mockStore = configureStore(middlewares);
    store = mockStore({ board: initialState });
  });

  it('should render', () => {
    expect(
      render(
        <Provider store={store}>
          <BrowserTopBar {...browserTopBarProps} />
        </Provider>
      )
    ).toBeTruthy();
  });
});
