/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import React from 'react';

import { useStoreHelpers } from 'renderer/hooks/useStoreHelpers';
import { ButtonAddBrowser } from 'renderer/components/ButtonAddBrowser';
import { Browser } from 'renderer/components/Browser';
import { useBoard } from 'renderer/hooks/useBoard';

import './style.css';

export const Board: React.FC = () => {
  const { browser } = useStoreHelpers();
  const board = useBoard();

  return (
    <div className="Board__container">
      <ButtonAddBrowser onClick={browser.add} />

      {board?.browsers.map((b) => {
        return <Browser {...b} key={b.id} firstRendering />;
      })}
    </div>
  );
};
