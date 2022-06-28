/* eslint-disable @typescript-eslint/ban-ts-comment */
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';

import { Board } from '../renderer/App/components/Board';
import { mockWindow } from './beforeAll';
import { store } from '../renderer/App/store/store';
import {
  addBrowser,
  removeBrowser,
} from '../renderer/App/store/reducers/Board';

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

describe('Board', () => {
  beforeAll(() => {
    mockWindow();
  });

  it('should render', () => {
    expect(
      render(
        <Provider store={store}>
          <Board />
        </Provider>
      )
    ).toBeTruthy();
  });

  it('should have one browser in board because of initialState', () => {
    const { container } = render(
      <Provider store={store}>
        <Board />
      </Provider>
    );
    expect(
      container.getElementsByClassName('Browser__draggable-container').length
    ).toBe(1);
  });

  it('should have two browsers in board after dispatch', () => {
    store.dispatch(addBrowser(addBrowserAction));

    const { container } = render(
      <Provider store={store}>
        <Board />
      </Provider>
    );
    expect(
      container.getElementsByClassName('Browser__draggable-container').length
    ).toBe(2);
  });

  it('should have one browser in board after remove', () => {
    store.dispatch(removeBrowser(addBrowserAction.id));

    const { container } = render(
      <Provider store={store}>
        <Board />
      </Provider>
    );
    expect(
      container.getElementsByClassName('Browser__draggable-container').length
    ).toBe(1);
  });

  it('should have 1 browser in board after adding and clicking on close', () => {
    store.dispatch(addBrowser(addBrowserAction));

    render(
      <Provider store={store}>
        <Board />
      </Provider>
    );

    fireEvent.click(screen.getAllByTestId('close-browser')[0]);

    expect(screen.getAllByTestId('browser-window').length).toBe(1);
  });
});
