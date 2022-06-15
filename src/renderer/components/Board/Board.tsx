/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import React, { useEffect, useCallback } from 'react';
import { v4 } from 'uuid';

import { ButtonAddBrowser } from '../ButtonAddBrowser';
import { Browser } from '../Browser';
import { addBrowser } from '../../store/reducers/Addaps';
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

  const makeAndAddBrowser = useCallback(
    (params: { url?: string }): void => {
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
    },
    [dispatch]
  );

  useEffect(() => {
    window.bonb.listener.newWindow((_e, args: { url: string }) =>
      makeAndAddBrowser(args)
    );
  }, []);

  useEffect(() => {
    window.addEventListener(
      'keydown',
      (e) => {
        if (e.ctrlKey && e.key === 't') {
          makeAndAddBrowser({});
        }
      },
      false
    );
  }, []);

  return (
    <div className="Board__container">
      <ButtonAddBrowser onClick={makeAndAddBrowser} />

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
