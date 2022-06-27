/* eslint-disable react/jsx-props-no-spreading */
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { LeftBar } from '../renderer/App/components/LeftBar';
import { mockWindow } from './beforeAll';
import {
  addBrowser,
  removeBrowser,
} from '../renderer/App/store/reducers/Board';
import { store } from '../renderer/App/store/store';

const addBrowserAction = {
  id: 'randomid',
  url: 'https://www.github.com',
  top: 0,
  left: 0,
  height: 800,
  width: 600,
  firstRendering: true,
  favicon: '',
};

describe('LeftBar', () => {
  beforeAll(() => {
    mockWindow();
  });

  it('should render', () => {
    expect(
      render(
        <Provider store={store}>
          <LeftBar />
        </Provider>
      )
    ).toBeTruthy();
  });

  it('should have one browser because of initial state', () => {
    const { container } = render(
      <Provider store={store}>
        <LeftBar />
      </Provider>
    );

    expect(container.getElementsByClassName('LeftBar__browserFav').length).toBe(
      1
    );
  });

  it('should have two browsers in the store', () => {
    store.dispatch(addBrowser(addBrowserAction));
    expect(store.getState().board.board.browsers.length).toBe(2);
  });

  it('should have two browsers in dom', () => {
    const { container } = render(
      <Provider store={store}>
        <LeftBar />
      </Provider>
    );

    expect(container.getElementsByClassName('LeftBar__browserFav').length).toBe(
      2
    );
  });

  it('should have one browser in the store', () => {
    store.dispatch(removeBrowser(addBrowserAction.id));
    expect(store.getState().board.board.browsers.length).toBe(1);
  });

  it('should have 1 browser in dom', () => {
    const { container } = render(
      <Provider store={store}>
        <LeftBar />
      </Provider>
    );

    expect(container.getElementsByClassName('LeftBar__browserFav').length).toBe(
      1
    );
  });
});
