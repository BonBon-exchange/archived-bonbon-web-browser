/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { bringBrowserToTheFront } from '../../helpers/d2';

import './style.css';

export const LeftBar: React.FC = () => {
  const { boards, activeBoard } = useAppSelector((state) => state.addaps);
  const board = boards.find((b) => b.id === activeBoard);

  const scrollToBrowser = (browserId: string): void => {
    document.querySelector(`#Browser__${browserId}`)?.scrollIntoView();
    window.scrollBy(0, -100);

    bringBrowserToTheFront(
      document,
      document.querySelector(`#Browser__${browserId}`)
    );
  };

  return (
    <div className="LeftBar__browserFavContainer">
      {board?.browsers.map((b) => {
        return (
          <div
            className="LeftBar__browserFav"
            key={b.id}
            onClick={() => scrollToBrowser(b.id)}
          >
            <img src={b.favicon} width="32" height="32" />
          </div>
        );
      })}
    </div>
  );
};
