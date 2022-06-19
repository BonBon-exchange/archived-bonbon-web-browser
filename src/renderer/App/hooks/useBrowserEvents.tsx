/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/prefer-default-export */
import {
  PageFaviconUpdatedEvent,
  PageTitleUpdatedEvent,
  IpcMessageEvent,
} from 'electron';
import { useCallback, useEffect } from 'react';

import { useAppDispatch } from 'renderer/App/store/hooks';
import {
  updateBrowserUrl,
  updateBrowserFav,
  updateBrowserTitle,
  setActiveBrowser,
} from 'renderer/App/store/reducers/Board';
import { bringBrowserToTheFront } from 'renderer/App/helpers/d2';
import { useStoreHelpers } from './useStoreHelpers';

export const useBrowserEvents = (browserId: string) => {
  const container = document.querySelector(`#Browser__${browserId}`);
  const webview = container?.querySelector('webview');

  const dispatch = useAppDispatch();
  const { browser } = useStoreHelpers();

  const ipcMessageListener = useCallback(
    (e: Event, _args: unknown[]) => {
      const event = e as IpcMessageEvent;
      if (event.channel === 'clickOnPage') {
        bringBrowserToTheFront(document, container);
        dispatch(setActiveBrowser(browserId));
      }
      if (event.channel === 'ctrl+t') {
        browser.add({});
      }
    },
    [browserId, container, dispatch, browser]
  );

  const loadCommitListener = useCallback(
    (e: Event) => {
      const target = e.target as HTMLSourceElement;
      setTimeout(() => {
        dispatch(
          updateBrowserUrl({
            url: target?.src,
            browserId,
          })
        );
      }, 0);
    },
    [browserId, dispatch]
  );

  const pageFaviconUpdatedListener = useCallback(
    (e: Event) => {
      const event = e as PageFaviconUpdatedEvent;
      dispatch(
        updateBrowserFav({
          favicon: event.favicons[0],
          browserId,
        })
      );
    },
    [browserId, dispatch]
  );

  const pageTitleUpdatedListener = useCallback(
    (e: Event) => {
      const event = e as PageTitleUpdatedEvent;
      dispatch(updateBrowserTitle({ browserId, title: event.title }));
    },
    [browserId, dispatch]
  );

  const containerClickListener = useCallback(() => {
    dispatch(setActiveBrowser(browserId));
  }, [browserId, dispatch]);

  useEffect(() => {
    webview?.addEventListener('load-commit', loadCommitListener);
    webview?.addEventListener('page-title-updated', pageTitleUpdatedListener);
    webview?.addEventListener(
      'page-favicon-updated',
      pageFaviconUpdatedListener
    );
    // @ts-ignore
    webview?.addEventListener('ipc-message', ipcMessageListener);
    container?.addEventListener('click', containerClickListener);

    return () => {
      webview?.removeEventListener('load-commit', loadCommitListener);
      webview?.removeEventListener(
        'page-title-updated',
        pageTitleUpdatedListener
      );
      webview?.removeEventListener(
        'page-favicon-updated',
        pageFaviconUpdatedListener
      );
      // @ts-ignore
      webview?.removeEventListener('ipc-message', ipcMessageListener);

      container?.removeEventListener('click', containerClickListener);
    };
  }, [
    loadCommitListener,
    pageFaviconUpdatedListener,
    pageTitleUpdatedListener,
    containerClickListener,
    ipcMessageListener,
    container,
    webview,
  ]);
};
