/* eslint-disable react/jsx-props-no-spreading */
import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import { Browser } from '../renderer/App/components/Browser';
import { mockWindow } from './beforeAll';
import { store } from '../renderer/App/store/store';
import { toggleBoardFullSize } from '../renderer/App/store/reducers/Board';

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

  it('should be fullsize', () => {
    store.dispatch(toggleBoardFullSize());
    const { container } = render(
      <Provider store={store}>
        <Browser {...browserProps} />
      </Provider>
    );

    const browser = container.getElementsByClassName('Browser__is-full-size');
    expect(browser.length).toBe(1);
  });

  it('should toggle fullsize', () => {
    render(
      <Provider store={store}>
        <Browser {...browserProps} />
      </Provider>
    );

    fireEvent.click(screen.getByTestId('toggle-enlarge-browser'));

    expect(
      screen
        .getByTestId('browser-window')
        .className.includes('Browser__is-full-size')
    ).toBeFalsy();
  });
});
