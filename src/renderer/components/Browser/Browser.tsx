/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import React, { useEffect, useRef } from 'react';
import WebView from '@tianhuil/react-electron-webview';
import { Rnd } from 'react-rnd';

import { BrowserTopBar } from '../BrowserTopBar';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setBoards } from '../../store/reducers/Addaps';

import { BrowserProps } from './Types';

import './style.css';

export const Browser: React.FC<BrowserProps> = ({
  id,
  url,
  top,
  left,
  height,
  width,
}) => {
  const container = useRef(null);
  const dispatch = useAppDispatch();
  const { boards, activeBoard } = useAppSelector((state) => state.addaps);

  const updateBoard = (bds, ab, top, left, url) => {
    const newBoards = [...bds];
    const boardIndex = bds.findIndex((b) => b.id === ab);
    const newBoard = { ...newBoards[boardIndex] };
    const newBrowserIndex = newBoard.browsers.findIndex((b) => b.id === id);
    const newBrowsers = [...newBoard.browsers];
    const newBrowser = { ...newBrowsers[newBrowserIndex] };
    newBrowser.top = top;
    newBrowser.left = left;
    newBrowser.url = url;
    newBrowsers[newBrowserIndex] = newBrowser;
    newBoard.browsers = newBrowsers;
    newBoards[boardIndex] = newBoard;
    dispatch(setBoards(newBoards));
  };

  const getOffset = (el) => {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY,
    };
  };

  const onDragStart = () => {
    const webviews = document.querySelectorAll('.Browser__webview-container');
    webviews.forEach((webview) => {
      webview.style['pointer-events'] = 'none';
    });
  };

  const onDragStop = (e, data) => {
    updateBoard(
      boards,
      activeBoard,
      getOffset(e.target).top,
      getOffset(e.target).left,
      url
    );
    const webviews = document.querySelectorAll('.Browser__webview-container');
    webviews.forEach((webview) => {
      webview.style['pointer-events'] = 'auto';
    });
  };

  const onDidStartLoading = (e) => {
    updateBoard(boards, activeBoard, top, left, e.target.src);
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
    >
      <div className="Browser__container">
        <BrowserTopBar />
        <div className="Browser__webview-container">
          <WebView src={url} onDidStartLoading={onDidStartLoading} />
        </div>
      </div>
    </Rnd>
  );
};
