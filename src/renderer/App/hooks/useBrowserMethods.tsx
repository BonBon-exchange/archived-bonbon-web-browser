/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/prefer-default-export */
import { useCallback } from 'react';
import { scrollToBrowser } from 'renderer/App/helpers/d2';
import { useAppDispatch } from 'renderer/App/store/hooks';
import { setActiveBrowser } from 'renderer/App/store/reducers/Board';
import { useBoard } from './useBoard';

export const useBrowserMethods = () => {
  const dispatch = useAppDispatch();
  const boardState = useBoard();

  const focus = useCallback(
    (document: Document, browserId: string) => {
      scrollToBrowser(document, browserId);
      dispatch(setActiveBrowser(browserId));
      window.app.analytics.event('switch_browser');
    },
    [dispatch]
  );

  const next = useCallback(() => {
    const pos = boardState.browsers.findIndex(
      (b) => b.id === boardState.activeBrowser
    );
    const focusPos = pos === boardState.browsers.length - 1 ? 0 : pos + 1;
    const focusId = boardState.browsers[focusPos].id;
    return focusId;
  }, [boardState.activeBrowser, boardState.browsers]);

  const disablePointerEventsForAll = () => {
    const containers = document.querySelectorAll('.Browser__webview-container');
    containers.forEach((c) => {
      // @ts-ignore
      c.style['pointer-events'] = 'none';
    });
  };

  const enablePointerEventsForAll = () => {
    const containers = document.querySelectorAll('.Browser__webview-container');
    containers.forEach((c) => {
      // @ts-ignore
      c.style['pointer-events'] = 'auto';
    });
  };

  return {
    focus,
    next,
    disablePointerEventsForAll,
    enablePointerEventsForAll,
  };
};
