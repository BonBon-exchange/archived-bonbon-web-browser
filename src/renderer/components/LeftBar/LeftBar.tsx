import React from 'react';
import { useAppSelector } from '../../store/hooks';

import './style.css';

export const LeftBar: React.FC = () => {
  const { boards, activeBoard } = useAppSelector((state) => state.addaps);
  const board = boards.find((b) => b.id === activeBoard);

  const scrollToBrowser = (browserId: string): void => {
    document.querySelector(`#Browser__${browserId}`)?.scrollIntoView();
    window.scrollBy(0, -100);
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
