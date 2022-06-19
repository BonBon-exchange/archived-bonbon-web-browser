/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import React, { useEffect, useState, useRef } from 'react';
import { Rnd } from 'react-rnd';
import clsx from 'clsx';
import CryptoJS from 'crypto-js';

import { useBrowserEvents } from 'renderer/App/hooks/useBrowserEvents';
import { BrowserControlBar } from 'renderer/App/components/BrowserControlBar';
import { BrowserTopBar } from 'renderer/App/components/BrowserTopBar';
import { useAppDispatch } from 'renderer/App/store/hooks';
import {
  updateBrowserUrl,
  removeBrowser,
  updateBrowser,
  toggleBoardFullSize,
  setActiveBrowser,
} from 'renderer/App/store/reducers/Board';
import { bringBrowserToTheFront } from 'renderer/App/helpers/d2';
import { dataDb } from 'renderer/App/db/dataDb';
import { useBoard } from 'renderer/App/hooks/useBoard';

import { BrowserProps } from './Types';

import './style.css';

export const Browser: React.FC<BrowserProps> = ({
  id,
  url,
  top,
  left,
  height,
  width,
  firstRendering,
  favicon,
  title,
}) => {
  useBrowserEvents(id);
  const dispatch = useAppDispatch();
  const board = useBoard();
  const [firstRenderingState, setFirstRenderingState] = useState<boolean>(
    firstRendering || true
  );
  const [renderedUrl, setRenderedUrl] = useState<string>('');
  const container = useRef<HTMLDivElement>(null);
  const [isFullSize, setIsFullSize] = useState<boolean>(false);

  const webview = container.current?.querySelector('webview');

  const disablePointerEventsForOthers = () => {
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

  const getOffset = (el: Element) => {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
    };
  };

  const onDragStart = () => {
    disablePointerEventsForOthers();
  };

  const onDragStop = (e: any) => {
    dispatch(
      updateBrowser({
        browserId: id,
        params: {
          top: getOffset(e.target).top,
          left: getOffset(e.target).left,
        },
      })
    );

    enablePointerEventsForAll();
  };

  const onResizeStop = (delta: { width: number; height: number }) => {
    dispatch(
      updateBrowser({
        browserId: id,
        params: { width: width + delta.width, height: height + delta.height },
      })
    );
    enablePointerEventsForAll();
  };

  const onResizeStart = () => {
    disablePointerEventsForOthers();
  };

  const closeBrowser = () => {
    dispatch(removeBrowser(id));
  };

  const toggleFullsizeBrowser = () => {
    dispatch(toggleBoardFullSize());
  };

  const givePriorityToBrowser = () => {
    bringBrowserToTheFront(document, document.querySelector(`#Browser__${id}`));
    dispatch(setActiveBrowser(id));
  };

  const goBack = () => {
    webview?.goBack();
    window.app.analytics.event('browser_go_back');
  };

  const goForward = () => {
    webview?.goForward();
    window.app.analytics.event('browser_go_forward');
  };

  const reload = () => {
    webview?.reload();
    window.app.analytics.event('browser_reload');
  };

  const goHome = () => {
    webview?.loadURL('https://www.google.fr');
    dispatch(
      updateBrowserUrl({
        url: 'https://www.google.fr',
        browserId: id,
      })
    );
  };

  useEffect(() => {
    if (firstRenderingState) {
      setFirstRenderingState(false);
      setRenderedUrl(url);
    }
  }, [firstRenderingState, url]);

  useEffect(() => {
    bringBrowserToTheFront(document, document.querySelector(`#Browser__${id}`));
  }, [id]);

  useEffect(() => {
    window.app.analytics.event('browser_navigate');
    const encrypted = CryptoJS.AES.encrypt(
      url,
      localStorage.getItem('machineId') || 'bonb'
    );
    dataDb.navigate.add({ url: encrypted.toString(), date: new Date() });
  }, [url]);

  // Bug fix for Rnd renderer
  useEffect(() => {
    if (board?.isFullSize) {
      setIsFullSize(true);
    } else {
      setIsFullSize(false);
    }
  }, [board?.isFullSize]);

  return (
    <Rnd
      style={{ display: 'flex' }}
      default={{
        x: left,
        y: top,
        width,
        height,
      }}
      dragHandleClassName="BrowserTopBar__container"
      onDragStart={onDragStart}
      onDragStop={onDragStop}
      onResizeStop={(_e, _dir, _ref, delta, _pos) => onResizeStop(delta)}
      onResizeStart={onResizeStart}
      bounds=".Board__container"
      id={`Browser__${id}`}
      className={clsx({
        'Browser__is-full-size': isFullSize,
        'Browser__draggable-container': true,
      })}
      disableDragging={board?.isFullSize}
      enableResizing={board?.isFullSize ? {} : undefined}
    >
      <div className="Browser__container" ref={container}>
        <BrowserTopBar
          closeBrowser={closeBrowser}
          toggleFullsizeBrowser={toggleFullsizeBrowser}
          onClick={givePriorityToBrowser}
          title={title}
          favicon={favicon}
        />
        <BrowserControlBar
          goBack={goBack}
          goForward={goForward}
          reload={reload}
          goHome={goHome}
          url={url}
          browserId={id}
        />
        <div className="Browser__webview-container">
          <webview
            // @ts-ignore
            allowpopups="true"
            src={renderedUrl}
            partition="persist:user-partition"
          />
        </div>
      </div>
    </Rnd>
  );
};
