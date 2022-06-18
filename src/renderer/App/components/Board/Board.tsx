/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import React, { useEffect } from 'react';

import { useStoreHelpers } from 'renderer/App/hooks/useStoreHelpers';
import { ButtonAddBrowser } from 'renderer/App/components/ButtonAddBrowser';
import { Browser } from 'renderer/App/components/Browser';
import { useBoard } from 'renderer/App/hooks/useBoard';
import { useAppDispatch } from 'renderer/App/store/hooks';
import { setIsRenamingBoard } from 'renderer/App/store/reducers/Addaps';

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
