/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { scrollToBrowser } from '../../helpers/d2';

import './style.scss';

export const LeftBar: React.FC = () => {
  const { boards, activeBoard } = useAppSelector((state) => state.addaps);
  const board = boards.find((b) => b.id === activeBoard);

  return (
    <div className="LeftBar__browserFavContainer">
      {board?.browsers.map((b) => {
        return (
          <div
            className="LeftBar__browserFav"
            key={b.id}
            onClick={() => scrollToBrowser(document, b.id)}
          >
            <img
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
