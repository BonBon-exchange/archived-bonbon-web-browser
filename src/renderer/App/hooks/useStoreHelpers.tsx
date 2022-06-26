/* eslint-disable promise/no-nesting */
/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
/* eslint-disable import/prefer-default-export */
import { useCallback } from 'react';
import { v4 } from 'uuid';

import { useAppDispatch } from 'renderer/App/store/hooks';

import {
  addBrowser,
  setBoard,
  removeBrowser,
  removeLastCloseUrl,
} from 'renderer/App/store/reducers/Board';
import {
  scrollToBrowser,
  getCoordinateWithNoCollision,
} from 'renderer/App/helpers/d2';
import { useBoard } from './useBoard';

export const useStoreHelpers = (helpersParams?: { boardId?: string }) => {
  const dispatch = useAppDispatch();
  const board = useBoard();

  const makeAndAddBrowser = useCallback(
    (params: { url?: string }): void => {
      if (board) {
        const browserId = v4();
        const { x, y } = getCoordinateWithNoCollision(
          document,
          board,
          800,
          600
        );
        const newBrowser = {
          id: browserId,
          url: params.url || 'https://www.google.com',
          top: y,
          left: x,
          height: 800,
          width: 600,
          firstRendering: true,
          favicon: '',
        };
        dispatch(addBrowser(newBrowser));
        setTimeout(() => scrollToBrowser(document, browserId), 300);
      }
    },
    [board, dispatch]
  );

  const createBoard = useCallback(
    (params: { id?: string }) => {
      const browserId = v4();
      const newBrowser = {
        id: browserId,
        url: 'https://www.google.com',
        top: 120,
        left: 120,
        height: 800,
        width: 600,
        firstRendering: true,
        favicon: '',
        title: '',
      };
      const id = params.id || v4();
      const newBoard = {
        id,
        label: `New board`,
        browsers: [newBrowser],
        closedUrls: [],
        isFullSize: false,
      };

      dispatch(setBoard(newBoard));
      window.app.analytics.event('add_board');
    },
    [dispatch]
  );

  const loadBoard = useCallback(
    (params: { id: string }) => {
      window.app.analytics.event('load_board');
      if (board.id === helpersParams?.boardId) return;
      createBoard(params);
    },
    [createBoard, board.id, helpersParams?.boardId]
  );

  const closeBrowser = useCallback(
    (browserId: string) => {
      dispatch(removeBrowser(browserId));
    },
    [dispatch]
  );

  const closeBoard = useCallback(() => {
    window.app.board.close();
  }, []);

  const reopenLastClosed = useCallback(() => {
    if (board.closedUrls.length > 0) {
      makeAndAddBrowser({ url: board.closedUrls[board.closedUrls.length - 1] });
      dispatch(removeLastCloseUrl());
    }
  }, [board.closedUrls, dispatch, makeAndAddBrowser]);

  return {
    browser: {
      add: makeAndAddBrowser,
      close: closeBrowser,
      reopenLastClosed,
    },
    board: {
      create: createBoard,
      load: loadBoard,
      close: closeBoard,
    },
  };
};
