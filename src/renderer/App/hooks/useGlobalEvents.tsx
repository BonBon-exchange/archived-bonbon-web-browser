/* eslint-disable spaced-comment */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/prefer-default-export */
import { useCallback, useEffect } from 'react';

import { useStoreHelpers } from 'renderer/App/hooks/useStoreHelpers';
import {
  removeBrowser,
  removeAllBrowsers,
} from 'renderer/App/store/reducers/Board';
import { useAppDispatch } from 'renderer/App/store/hooks';
import { useBoard } from './useBoard';

export const useGlobalEvents = () => {
  const { browser, board } = useStoreHelpers();
  const dispatch = useAppDispatch();
  const boardState = useBoard();

  const keyDownListener = useCallback(
    (e: { ctrlKey: boolean; shiftKey: boolean; key: string }) => {
      if (e.ctrlKey && !e.shiftKey && e.key === 't') {
        browser.add({});
      }
      if (e.ctrlKey && !e.shiftKey && e.key === 'w') {
        if (boardState.activeBrowser) browser.close(boardState.activeBrowser);
        else board.close();
      }
      if (e.ctrlKey && e.shiftKey && e.key === 'W') {
        board.close();
      }
    },
    [browser, boardState.activeBrowser, board]
  );

  const scrollListener = () => {
    const containerHeight =
      document.querySelector('.Board__container')?.clientHeight;
    const heightDistance =
      document.documentElement.getBoundingClientRect().bottom * -1 +
      window.innerHeight -
      30;
    if (Number(containerHeight) - heightDistance < 100) {
      // @ts-ignore
      document.querySelector('.Board__container').style.height = `${
        Number(containerHeight) + 100
      }px`;
    }
  };

  const newWindowAction = useCallback(
    (_e: any, args: { url: string }) => browser.add(args),
    [browser]
  );

  const closeWebviewAction = useCallback(
    (_e: any, args: { x: number; y: number }) => {
      const el = document.elementFromPoint(args.x, args.y);
      const browserId = el?.getAttribute('data-browserid');
      if (browserId) {
        window.app.browser.selectBrowserView();
        dispatch(removeBrowser(browserId));
      }
    },
    [dispatch]
  );

  const closeAllWebviewAction = useCallback(() => {
    window.app.browser.selectBrowserView();
    dispatch(removeAllBrowsers());
  }, [dispatch]);

  const matchMediaListener = (e: { matches: boolean }) => {
    const colorScheme = e.matches ? 'dark-theme' : 'light-theme';
    //@ts-ignore
    window.document.querySelector('body').className = colorScheme;
    window.app.analytics.event('toggle_darkmode', { theme: colorScheme });
  };

  useEffect(() => {
    window.app.listener.newWindow(newWindowAction);
    return () => window.app.off.newWindow();
  }, [newWindowAction]);

  useEffect(() => {
    window.app.listener.closeWebview(closeWebviewAction);
    return () => window.app.off.closeWebview();
  }, [closeWebviewAction]);

  useEffect(() => {
    window.app.listener.closeAllWebview(closeAllWebviewAction);
    return () => window.app.off.closeAllWebview();
  }, [closeAllWebviewAction]);

  useEffect(() => {
    window.addEventListener('keydown', keyDownListener, false);
    return () => window.removeEventListener('keydown', keyDownListener);
  }, [keyDownListener]);

  useEffect(() => {
    window.addEventListener('scroll', scrollListener);
    return () => window.removeEventListener('scroll', scrollListener);
  }, []);

  useEffect(() => {
    //@ts-ignore
    window.document.querySelector('body').className = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches
      ? 'dark-theme'
      : 'light-theme';

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', matchMediaListener);

    return () =>
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', matchMediaListener);
  }, []);
};
