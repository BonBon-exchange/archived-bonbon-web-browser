/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
import React from 'react';

import { scrollToBrowser } from 'renderer/App/helpers/d2';
import { useBoard } from 'renderer/App/hooks/useBoard';

import './style.scss';

export const LeftBar: React.FC = () => {
  const board = useBoard();

  const clickOnFavicon = (browserId: string) => {
    scrollToBrowser(document, browserId);
    window.app.analytics.event('switch_browser');
  };

  return (
    <div className="LeftBar__browserFavContainer">
      {board?.browsers.map((b) => {
        return (
          <div
            className="LeftBar__browserFav"
            key={b.id}
            onClick={() => clickOnFavicon(b.id)}
          >
            <img
              data-tip={b.title}
              src={b.favicon}
              className="LeftBar__browserFavImg"
              data-browserid={b.id}
            />
          </div>
        );
      })}
    </div>
  );
};
