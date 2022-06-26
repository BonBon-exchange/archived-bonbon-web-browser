import '@testing-library/jest-dom';
import { render } from '@testing-library/react';

import { mockWindow } from './beforeAll';
import { App } from '../renderer/App/App';

describe('App', () => {
  beforeAll(() => {
    mockWindow();
  });

  it('should render', () => {
    expect(render(<App />)).toBeTruthy();
  });
});
