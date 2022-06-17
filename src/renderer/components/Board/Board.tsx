/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import React, { useEffect } from 'react';

import { useStoreHelpers } from 'renderer/hooks/useStoreHelpers';
import { ButtonAddBrowser } from 'renderer/components/ButtonAddBrowser';
import { Browser } from 'renderer/components/Browser';
import { useBoard } from 'renderer/hooks/useBoard';
import { useAppDispatch } from 'renderer/store/hooks';
import { setIsRenamingBoard } from 'renderer/store/reducers/Addaps';

import './style.css';

export const Board: React.FC = () => {
  const { browser } = useStoreHelpers();
  const board = useBoard();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setIsRenamingBoard(null));
  }, [dispatch]);

  return (
    <div className="Board__container">
      <ButtonAddBrowser onClick={browser.add} />

      {board?.browsers.map((b) => {
        return <Browser {...b} key={b.id} firstRendering />;
      })}
    </div>
  );
};
