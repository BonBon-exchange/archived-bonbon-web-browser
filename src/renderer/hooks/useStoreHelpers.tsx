/* eslint-disable import/prefer-default-export */
import { useDispatch } from 'react-redux';
import { v4 } from 'uuid';

import { addBrowser } from '../store/reducers/Addaps';
import { scrollToBrowser, getCoordinateWithNoCollision } from '../helpers/d2';

export const useStoreHelpers = () => {
  const dispatch = useDispatch();

  const makeAndAddBrowser = (params: { url?: string }): void => {
    const browserId = v4();
    const { x, y } = getCoordinateWithNoCollision(document, 800, 600);
    const newBrowser = {
      id: browserId,
      url: params.url || 'https://www.google.fr',
      top: y,
      left: x,
      height: 800,
      width: 600,
      isFullSize: false,
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
