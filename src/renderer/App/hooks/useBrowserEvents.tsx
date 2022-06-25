/* eslint-disable no-case-declarations */
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
  updateBrowser,
} from 'renderer/App/store/reducers/Board';
import { bringBrowserToTheFront } from 'renderer/App/helpers/d2';

export const useBrowserEvents = (browserId: string) => {
  const container = document.querySelector(
    `#Browser__${browserId}`
  ) as HTMLElement;
  const webview: Electron.WebviewTag | undefined | null =
    container?.querySelector('webview') as Electron.WebviewTag;

  const dispatch = useAppDispatch();

  const ipcMessageListener = useCallback(
    (e: Event & { args: any }) => {
      const event = e as IpcMessageEvent;
      switch (event.channel) {
        default:
          break;

        case 'AltDown':
          const altDownEvent = new KeyboardEvent('keydown', { key: 'Alt' });
          window.dispatchEvent(altDownEvent);
          break;

        case 'AltUp':
          const altUpEvent = new KeyboardEvent('keyup', { key: 'Alt' });
          window.dispatchEvent(altUpEvent);
          break;

        case 'clickOnPage':
          bringBrowserToTheFront(document, container);
          dispatch(setActiveBrowser(browserId));
          break;

        case 'ctrl+Tab':
          const ctrlTabEvent = new KeyboardEvent('keydown', {
            key: 'Tab',
            ctrlKey: true,
            shiftKey: false,
          });
          window.dispatchEvent(ctrlTabEvent);
          break;

        case 'ctrl+shift+Tab':
          const ctrlShiftTabEvent = new KeyboardEvent('keydown', {
            key: 'Tab',
            ctrlKey: true,
            shiftKey: true,
          });
          window.dispatchEvent(ctrlShiftTabEvent);
          break;

        case 'ctrl+t':
          const ctrlTEvent = new KeyboardEvent('keydown', {
            key: 't',
            ctrlKey: true,
            shiftKey: false,
          });
          window.dispatchEvent(ctrlTEvent);
          break;

        case 'ctrl+shift+T':
          const ctrlShiftTEvent = new KeyboardEvent('keydown', {
            key: 'T',
            ctrlKey: true,
            shiftKey: true,
          });
          window.dispatchEvent(ctrlShiftTEvent);
          break;

        case 'ctrl+r':
          const ctrlREvent = new KeyboardEvent('keydown', {
            key: 'r',
            ctrlKey: true,
            shiftKey: false,
          });
          window.dispatchEvent(ctrlREvent);
          break;

        case 'ctrl+w':
          const ctrlWEvent = new KeyboardEvent('keydown', {
            key: 'w',
            ctrlKey: true,
            shiftKey: false,
          });
          window.dispatchEvent(ctrlWEvent);
          break;

        case 'ctrl+shift+W':
          const ctrlShiftWEvent = new KeyboardEvent('keydown', {
            key: 'W',
            ctrlKey: true,
            shiftKey: true,
          });
          window.dispatchEvent(ctrlShiftWEvent);
          break;

        case 'created-webcontents':
          dispatch(
            updateBrowser({
              browserId,
              params: { webContentsId: e.args[0].webContentsId },
            })
          );
          break;
      }
    },
    [browserId, container, dispatch]
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
    bringBrowserToTheFront(document, container);
    dispatch(setActiveBrowser(browserId));
  }, [browserId, dispatch, container]);

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
