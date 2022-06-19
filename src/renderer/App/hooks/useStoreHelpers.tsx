/* eslint-disable promise/no-nesting */
/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
/* eslint-disable import/prefer-default-export */
import { v4 } from 'uuid';

import { useAppDispatch, useAppSelector } from 'renderer/App/store/hooks';

import {
  addBrowser,
  addBoard,
  setActiveBoard,
} from 'renderer/App/store/reducers/Addaps';
import {
  scrollToBrowser,
  getCoordinateWithNoCollision,
} from 'renderer/App/helpers/d2';
import { useBoard } from './useBoard';
import { userDb } from '../db/userDb';

export const useStoreHelpers = () => {
  const dispatch = useAppDispatch();
  const { boards } = useAppSelector((state) => state.addaps);
  const board = useBoard();

  const makeAndAddBrowser = (params: { url?: string }): void => {
    if (board) {
      const browserId = v4();
      const { x, y } = getCoordinateWithNoCollision(document, board, 800, 600);
      const newBrowser = {
        id: browserId,
        url: params.url || 'https://www.google.fr',
        top: y,
        left: x,
        height: 800,
        width: 600,
        firstRendering: true,
        favicon: '',
      };
      dispatch(addBrowser(newBrowser));
      setTimeout(() => scrollToBrowser(document, browserId), 300);
      window.bonb.analytics.event('add_browser');
    }
  };

  const makeAndAddBoard = (params: { id?: string }) => {
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
      label: `Board ${boards.length + 1}`,
      browsers: [newBrowser],
      isFullSize: false,
    };

    dispatch(addBoard(newBoard));
    window.bonb.analytics.event('add_board');
  };

  const loadBoard = (params: { id: string }) => {
    const boardExist = boards.find((b) => b.id === params.id);
    if (boardExist) {
      dispatch(setActiveBoard(params.id));
    } else {
      userDb.boards
        .where(params)
        .toArray()
        .then((bds) => {
          if (bds.length > 0) {
            userDb.browsers
              .where({ boardId: params.id })
              .toArray()
              .then((res) => {
                const boardToAdd = {
                  browsers: res,
                  ...bds[0],
                };
                dispatch(addBoard(boardToAdd));
              });
          } else {
            makeAndAddBoard(params);
          }
        });
    }
  };

  return {
    browser: {
      add: makeAndAddBrowser,
    },
    board: {
      add: makeAndAddBoard,
      load: loadBoard,
    },
  };
};
