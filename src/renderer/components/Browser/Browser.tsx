/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import React, { useEffect, useState, useRef } from 'react';
import { Rnd } from 'react-rnd';
import clsx from 'clsx';

import { BrowserControlBar } from '../BrowserControlBar';
import { BrowserTopBar } from '../BrowserTopBar';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  setBoards,
  updateBrowserUrl,
  updateBrowserFav,
  removeBrowser,
} from '../../store/reducers/Addaps';
import { bringBrowserToTheFront } from '../../helpers/d2';
import { dataDb } from '../../db/dataDb';

import { BrowserProps } from './Types';

import './style.css';

export const Browser: React.FC<BrowserProps> = ({
  id,
  url,
  top,
  left,
  height,
  width,
  isFullSize,
  firstRendering,
  favicon,
}) => {
  const dispatch = useAppDispatch();
  const { boards, activeBoard } = useAppSelector((state) => state.addaps);
  const [title, setTitle] = useState<string>('');
  const [firstRenderingState, setFirstRenderingState] = useState<boolean>(
    firstRendering || true
  );
  const [renderedUrl, setRenderedUrl] = useState<string>('');
  const container = useRef(null);

  const disablePointerEventsForOthers = () => {
    const webviews = document.querySelectorAll('.Browser__webview-container');
    webviews.forEach((webview) => {
      // @ts-ignore
      webview.style['pointer-events'] = 'none';
    });
  };

  const enablePointerEventsForAll = () => {
    const webviews = document.querySelectorAll('.Browser__webview-container');
    webviews.forEach((webview) => {
      // @ts-ignore
      webview.style['pointer-events'] = 'auto';
    });
  };

  const updateBoard = (update: Record<string, unknown>) => {
    const newBoards = [...boards];
    const boardIndex = newBoards.findIndex((b) => b.id === activeBoard);
    const newBoard = { ...newBoards[boardIndex] };
    const newBrowserIndex = newBoard.browsers.findIndex((b) => b.id === id);
    const newBrowsers = [...newBoard.browsers];
    const newBrowser = { ...newBrowsers[newBrowserIndex], ...update };

    newBrowsers[newBrowserIndex] = newBrowser;
    newBoard.browsers = newBrowsers;
    newBoards[boardIndex] = newBoard;
    dispatch(setBoards(newBoards));
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
    updateBoard({
      top: getOffset(e.target).top,
      left: getOffset(e.target).left,
    });

    enablePointerEventsForAll();
  };

  const onResizeStop = (delta: { width: number; height: number }) => {
    updateBoard({ width: width + delta.width, height: height + delta.height });
    enablePointerEventsForAll();
  };

  const onResizeStart = () => {
    disablePointerEventsForOthers();
  };

  const closeBrowser = () => {
    dispatch(removeBrowser({ browserId: id }));
  };

  const toggleFullsizeBrowser = () => {
    const boardIndex = boards.findIndex((b) => b.id === activeBoard);
    const browserIndex = boards[boardIndex].browsers.findIndex(
      (b) => b.id === id
    );
    const fullSize = !boards[boardIndex].browsers[browserIndex].isFullSize;
    updateBoard({ isFullSize: fullSize });
  };

  const goBack = () => {
    container.current?.querySelector('webview').goBack();
  };

  const goForward = () => {
    container.current?.querySelector('webview').goForward();
  };

  const reload = () => {
    container.current?.querySelector('webview').reload();
  };

  const goHome = () => {
    container.current
      ?.querySelector('webview')
      .loadURL('https://www.google.fr');
    dispatch(
      updateBrowserUrl({
        url: 'https://www.google.fr',
        browserId: id,
        boardId: activeBoard,
      })
    );
  };

  const style = {
    display: 'flex',
    border: 'solid 1px #ddd',
    background: '#f0f0f0',
  } as const;

  useEffect(() => {
    if (firstRenderingState) {
      setFirstRenderingState(false);
      setRenderedUrl(url);
    }
  }, [firstRenderingState, url]);

  useEffect(() => {
    const webview = container.current?.querySelector('webview');

    webview.addEventListener('dom-ready', () => {
      // webview.openDevTools();
    });

    webview.addEventListener('page-title-updated', (e) => {
      setTitle(e.title);
    });

    webview.addEventListener('ipc-message', (event, ...args) => {
      if (event.channel === 'clickOnPage') {
        bringBrowserToTheFront(
          document,
          container.current?.closest('.Browser__draggable-container')
        );
      }
    });
  }, []);

  useEffect(() => {
    const webview = container.current?.querySelector('webview');
    webview.addEventListener('page-favicon-updated', (e) => {
      dispatch(
        updateBrowserFav({
          favicon: e.favicons[0],
          boardId: activeBoard,
          browserId: id,
        })
      );
    });

    webview.addEventListener('load-commit', (e: any) => {
      dispatch(
        updateBrowserUrl({
          url: e.target.src,
          browserId: id,
          boardId: activeBoard,
        })
      );
    });
  }, [activeBoard, dispatch, id]);

  useEffect(() => {
    bringBrowserToTheFront(document, document.querySelector(`#Browser__${id}`));
  }, [id]);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('analytics', {
      eventName: 'browser_navigate',
    });
    const encrypted = CryptoJS.AES.encrypt(
      url,
      localStorage.getItem('machineId')
    );
    dataDb.navigate.add({ url: encrypted.toString(), date: new Date() });
  }, [url]);

  return (
    <Rnd
      style={style}
      default={
        isFullSize
          ? undefined
          : {
              x: left,
              y: top,
              width,
              height,
            }
      }
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
      disableDragging={isFullSize}
    >
      <div className="Browser__container" ref={container}>
        <BrowserTopBar
          closeBrowser={closeBrowser}
          toggleFullsizeBrowser={toggleFullsizeBrowser}
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
