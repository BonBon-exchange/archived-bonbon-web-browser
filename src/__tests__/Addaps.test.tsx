import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Middleware } from '@reduxjs/toolkit';

import { mockWindow } from './beforeAll';
import { Addaps } from '../renderer/App/components/Addaps';
import { initialState } from '../renderer/App/store/reducers/Board';

let store: any;
const middlewares: Middleware[] = [];

describe('Addaps', () => {
  beforeAll(() => {
    mockWindow();
    const mockStore = configureStore(middlewares);

    // Initialize mockstore with empty state
    store = mockStore({ board: initialState });
  });

  it('should render with no boardId', () => {
    expect(
      render(
        <Provider store={store}>
          <Addaps />
        </Provider>
      )
    ).toBeTruthy();
  });

  it('should render with boardId', () => {
    expect(
      render(
        <Provider store={store}>
          <Addaps boardId="someboardid" />
        </Provider>
      )
    ).toBeTruthy();
  });
});
