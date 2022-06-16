/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import React from 'react';

import { useStoreHelpers } from 'renderer/hooks/useStoreHelpers';
import { ButtonAddBrowser } from 'renderer/components/ButtonAddBrowser';
import { Browser } from 'renderer/components/Browser';
import { useAppSelector } from 'renderer/store/hooks';

import './style.css';

export const Board: React.FC = () => {
  const { browser } = useStoreHelpers();
  const { boards, activeBoard } = useAppSelector((state) => state.addaps);
  const board = boards.find((b) => b.id === activeBoard);

  return (
    <div className="Board__container">
      <ButtonAddBrowser onClick={browser.add} />

      {board?.browsers.map((b) => {
        return <Browser {...b} key={b.id} firstRendering />;
      })}
    </div>
  );
};
