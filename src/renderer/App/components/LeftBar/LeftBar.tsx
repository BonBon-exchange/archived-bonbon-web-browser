/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
import React from 'react';

import { useBoard } from 'renderer/App/hooks/useBoard';
import { BrowserProps } from 'renderer/App/components/Browser/Types';
import { useBrowserMethods } from 'renderer/App/hooks/useBrowserMethods';

import './style.scss';

export const LeftBar: React.FC = () => {
  const board = useBoard();
  const { focus } = useBrowserMethods();

  return (
    <div className="LeftBar__browserFavContainer">
      {board?.browsers.map((b: BrowserProps) => {
        return (
          <div
            className="LeftBar__browserFav"
            key={b.id}
            onClick={() => focus(document, b.id)}
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
