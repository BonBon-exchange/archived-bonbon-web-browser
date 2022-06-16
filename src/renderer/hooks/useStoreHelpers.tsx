/* eslint-disable import/prefer-default-export */
import { v4 } from 'uuid';

import { useAppDispatch } from 'renderer/store/hooks';

import { addBrowser } from 'renderer/store/reducers/Addaps';
import {
  scrollToBrowser,
  getCoordinateWithNoCollision,
} from 'renderer/helpers/d2';
import { useBoard } from './useBoard';

export const useStoreHelpers = () => {
  const dispatch = useAppDispatch();
  const board = useBoard();

  const makeAndAddBrowser = (params: { url?: string }): void => {
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
  };

  return {
    browser: {
      add: makeAndAddBrowser,
    },
  };
};
