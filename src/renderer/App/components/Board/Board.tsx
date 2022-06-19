/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import React from 'react';

import { useStoreHelpers } from 'renderer/App/hooks/useStoreHelpers';
import { ButtonAddBrowser } from 'renderer/App/components/ButtonAddBrowser';
import { Browser } from 'renderer/App/components/Browser';
import { useBoard } from 'renderer/App/hooks/useBoard';

import { BrowserProps } from 'renderer/App/components/Browser/Types';

import './style.css';

export const Board: React.FC = () => {
  const { browser } = useStoreHelpers();
  const board = useBoard();

  return (
    <div className="Board__container">
      <ButtonAddBrowser onClick={browser.add} />

      {board?.browsers.map((b: BrowserProps) => {
        return <Browser {...b} key={b.id} firstRendering />;
      })}
    </div>
  );
};
