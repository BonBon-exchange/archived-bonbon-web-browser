import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { App } from '../renderer/App/App';

describe('App', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'app', {
      value: {
        analytics: {
          event: jest.fn(),
        },
        tools: {
          inspectElement: jest.fn(),
        },
        board: {
          open: jest.fn(),
          close: jest.fn(),
          selectNext: jest.fn(),
        },
        browser: {
          select: jest.fn(),
          selectBrowserView: jest.fn(),
        },
        listener: {
          newWindow: jest.fn(),
          loadBoard: jest.fn(),
          purge: jest.fn(),
          showLibrary: jest.fn(),
          showSettings: jest.fn(),
          saveBoard: jest.fn(),
          renameBoard: jest.fn(),
          closeWebview: jest.fn(),
          closeAllWebview: jest.fn(),
        },
        off: {
          newWindow: jest.fn(),
          loadBoard: jest.fn(),
          purge: jest.fn(),
          showLibrary: jest.fn(),
          showSettings: jest.fn(),
          saveBoard: jest.fn(),
          renameBoard: jest.fn(),
          closeWebview: jest.fn(),
          closeAllWebview: jest.fn(),
        },
      },
    });

    Object.defineProperty(window, 'darkmode', {
      value: {
        toggle: jest.fn(),
        system: jest.fn(),
      },
    });

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  it('should render', () => {
    expect(render(<App />)).toBeTruthy();
  });
});
