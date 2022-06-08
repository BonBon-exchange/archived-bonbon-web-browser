/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import React, { useState } from 'react';
import WebView from '@tianhuil/react-electron-webview';
import { Rnd } from 'react-rnd';
import clsx from 'clsx';

import { BrowserTopBar } from '../BrowserTopBar';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setBoards } from '../../store/reducers/Addaps';

import { BrowserProps } from './Types';
import { BoardType } from '../Board/Types';

import './style.css';

export const Browser: React.FC<BrowserProps> = ({
  id,
  url,
  top,
  left,
  height,
  width,
  isFullSize,
}) => {
  const dispatch = useAppDispatch();
  const { boards, activeBoard } = useAppSelector((state) => state.addaps);

  const updateBoard = (
    updateBoards: BoardType[],
    updateActiveBoard: string,
    updateTop: number,
    updateLeft: number,
    updateUrl: string,
    updateWidth: number,
    updateHeight: number,
    updateIsFullSize: boolean
  ) => {
    const newBoards = [...updateBoards];
    const boardIndex = newBoards.findIndex((b) => b.id === updateActiveBoard);
    const newBoard = { ...newBoards[boardIndex] };
    const newBrowserIndex = newBoard.browsers.findIndex((b) => b.id === id);
    const newBrowsers = [...newBoard.browsers];
    const newBrowser = { ...newBrowsers[newBrowserIndex] };
    newBrowser.top = updateTop;
    newBrowser.left = updateLeft;
    newBrowser.url = updateUrl;
    newBrowser.width = updateWidth;
    newBrowser.height = updateHeight;
    newBrowser.isFullSize = updateIsFullSize;
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
    updateBoard(
      boards,
      activeBoard,
      getOffset(e.target).top,
      getOffset(e.target).left,
      url,
      width,
      height,
      isFullSize
    );
    const webviews = document.querySelectorAll('.Browser__webview-container');
    webviews.forEach((webview) => {
      // @ts-ignore
      webview.style['pointer-events'] = 'auto';
    });
  };

  const onDidStartLoading = (e) => {
    updateBoard(
      boards,
      activeBoard,
      top,
      left,
      e.target.src,
      width,
      height,
      isFullSize
    );
  };

  const onResizeStop = (_e, _dir, _refToElement, delta, _position) => {
    updateBoard(
      boards,
      activeBoard,
      top,
      left,
      url,
      width + delta.width,
      height + delta.height,
      isFullSize
    );
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
    console.log(fullSize);

    updateBoard(boards, activeBoard, top, left, url, width, height, fullSize);
  };

  const style = {
    display: 'flex',
    border: 'solid 1px #ddd',
    background: '#f0f0f0',
  } as const;

  return (
    <Rnd
      style={style}
      default={{
        x: left,
        y: top,
        width,
        height,
      }}
      dragHandleClassName="BrowserTopBar__container"
      onDragStart={onDragStart}
      onDragStop={onDragStop}
      onResizeStop={onResizeStop}
      bounds=".Board__container"
      className={clsx({ 'Browser__is-full-size': isFullSize })}
    >
      <div className="Browser__container">
        <BrowserTopBar
          closeBrowser={closeBrowser}
          toggleFullsizeBrowser={toggleFullsizeBrowser}
        />
        <div className="Browser__webview-container">
          <WebView src={url} onDidStartLoading={onDidStartLoading} />
        </div>
      </div>
    </Rnd>
  );
};
