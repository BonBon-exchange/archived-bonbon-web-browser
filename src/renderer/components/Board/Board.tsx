/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import React, { useEffect, useCallback } from 'react';
import { v4 } from 'uuid';

import { ButtonAddBrowser } from '../ButtonAddBrowser';
import { Browser } from '../Browser';
import { setBoards } from '../../store/reducers/Addaps';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  scrollToBrowser,
  getCoordinateWithNoCollision,
} from '../../helpers/d2';

import './style.css';

export const Board: React.FC = () => {
  const dispatch = useAppDispatch();
  const { boards, activeBoard } = useAppSelector((state) => state.addaps);
  const board = boards.find((b) => b.id === activeBoard);

  const addBrowser = useCallback(
    ({ url }: { url?: string }): void => {
      const browserId = v4();
      const { x, y } = getCoordinateWithNoCollision(document, 800, 600);
      const newBrowser = {
        id: browserId,
        url: url || 'https://www.google.fr',
        top: y,
        left: x,
        height: 800,
        width: 600,
        isFullSize: false,
        firstRendering: true,
        favicon: '',
      };

      if (board) {
        const newBrowsers = [...board.browsers, newBrowser];
        const newBoard = { ...board, browsers: newBrowsers };
        const newBoards = [...boards];
        const boardIndex = newBoards.findIndex((b) => b.id === activeBoard);
        newBoards[boardIndex] = newBoard;
        dispatch(setBoards(newBoards));
        window.electron.ipcRenderer.sendMessage('analytics', {
          eventName: 'add_browser',
        });
        setTimeout(() => scrollToBrowser(document, browserId), 300);
      }
    },
    [activeBoard, board, boards, dispatch]
  );

  useEffect(() => {
    const webviews = document.querySelectorAll('webview');
    webviews.forEach((webview) => {
      webview.addEventListener('new-window', (e) => {
        addBrowser({ url: e.url });
      });
    });
  }, []);

  return (
    <div className="Board__container">
      <ButtonAddBrowser onClick={addBrowser} />

      {board?.browsers.map((b) => {
        return (
          <Browser
            url={b.url}
            top={b.top}
            left={b.left}
            key={b.id}
            id={b.id}
            width={b.width}
            height={b.height}
            isFullSize={b.isFullSize}
            favicon={b.favicon}
            firstRendering
          />
        );
      })}
    </div>
  );
};
