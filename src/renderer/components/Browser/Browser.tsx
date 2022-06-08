/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import React, { useEffect, useState, useRef } from 'react';
import { Rnd } from 'react-rnd';
import clsx from 'clsx';
import WebView from '@tianhuil/react-electron-webview';

import { BrowserControlBar } from '../BrowserControlBar';
import { BrowserTopBar } from '../BrowserTopBar';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setBoards, updateBrowserUrl } from '../../store/reducers/Addaps';

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
}) => {
  const dispatch = useAppDispatch();
  const { boards, activeBoard } = useAppSelector((state) => state.addaps);
  const [title, setTitle] = useState<string>('');
  const [firstRenderingState, setFirstRenderingState] =
    useState<boolean>(firstRendering);
  const [renderedUrl, setRenderedUrl] = useState<string>('');
  const container = useRef(null);

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
    const webviews = document.querySelectorAll('.Browser__webview-container');
    webviews.forEach((webview) => {
      // @ts-ignore
      webview.style['pointer-events'] = 'none';
    });
  };

  const onDragStop = (e) => {
    updateBoard({
      top: getOffset(e.target).top,
      left: getOffset(e.target).left,
    });
    const webviews = document.querySelectorAll('.Browser__webview-container');
    webviews.forEach((webview) => {
      // @ts-ignore
      webview.style['pointer-events'] = 'auto';
    });
  };

  const onDidStartLoading = (e) => {
    dispatch(
      updateBrowserUrl({
        url: e.target.src,
        browserId: id,
        boardId: activeBoard,
      })
    );
  };

  const onResizeStop = (delta) => {
    updateBoard({ width: width + delta.width, height: height + delta.height });
  };

  const closeBrowser = () => {
    const newBoards = [...boards];
    const boardIndex = newBoards.findIndex((b) => b.id === activeBoard);
    const newBoard = { ...newBoards[boardIndex] };
    const newBrowsers = [...newBoard.browsers];
    const newBrowserIndex = newBrowsers.findIndex((b) => b.id === id);
    newBrowsers.splice(newBrowserIndex, 1);
    newBoard.browsers = newBrowsers;
    newBoards[boardIndex] = newBoard;
    dispatch(setBoards(newBoards));
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
    container.current.querySelector('webview').goBack();
  };

  const goForward = () => {
    container.current.querySelector('webview').goForward();
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
      bounds=".Board__container"
      className={clsx({ 'Browser__is-full-size': isFullSize })}
      disableDragging={isFullSize}
    >
      <div className="Browser__container" ref={container}>
        <BrowserTopBar
          closeBrowser={closeBrowser}
          toggleFullsizeBrowser={toggleFullsizeBrowser}
          title={title}
        />
        <BrowserControlBar goBack={goBack} goForward={goForward} />
        <div className="Browser__webview-container">
          <WebView
            src={renderedUrl}
            onPageTitleSet={(e) => setTitle(e.title)}
            onLoadCommit={onDidStartLoading}
            partition="user-partition"
            preload="./webview-preload.js"
          />
        </div>
      </div>
    </Rnd>
  );
};
