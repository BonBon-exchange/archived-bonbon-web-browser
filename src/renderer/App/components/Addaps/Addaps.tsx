/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import React, { useCallback, useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';

import { useGlobalEvents } from 'renderer/App/hooks/useGlobalEvents';
// import { TopBar } from 'renderer/components/TopBar';
import { Board } from 'renderer/App/components/Board';
import { LeftBar } from 'renderer/App/components/LeftBar';
import { ContextMenu } from 'renderer/App/components/ContextMenu';
import { Library } from 'renderer/App/components/Library';
import { useStoreHelpers } from 'renderer/App/hooks/useStoreHelpers';

import { ContextMenuProps } from 'renderer/App/components/ContextMenu/Types';
import { AddapsProps } from './Types';

import './style.css';
import 'renderer/style/dark.css';
import 'renderer/style/light.css';

export const Addaps: React.FC<AddapsProps> = ({ boardId }) => {
  useGlobalEvents();
  const { board } = useStoreHelpers();
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const [showLibrary, setShowLibrary] = useState<boolean>(false);
  const [contextMenuProps, setContextMenuProps] = useState<ContextMenuProps>({
    x: 0,
    y: 0,
    target: null,
  });

  const showLibraryAction = useCallback(
    () => setShowLibrary(!showLibrary),
    [showLibrary]
  );

  useEffect(() => {
    window.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      setContextMenuProps({
        x: e.x,
        y: e.y,
        targetId: e.target?.id,
        targetClass: e.target?.className,
        target: e.target,
      });
      setShowContextMenu(true);
    });

    window.addEventListener('click', () => setShowContextMenu(false));
  }, []);

  useEffect(() => {
    if (boardId) board.load({ id: boardId });
  }, [board, boardId]);

  useEffect(() => {
    window.bonb.listener.showLibrary(showLibraryAction);
    return () => window.bonb.off.showLibrary();
  }, [showLibraryAction]);

  return (
    <>
      {/* <TopBar setShowLibrary={setShowLibrary} /> */}
      <LeftBar />
      <Board />
      {showContextMenu && <ContextMenu {...contextMenuProps} />}
      {showLibrary && <Library closeLibrary={() => setShowLibrary(false)} />}
      <ReactTooltip />
    </>
  );
};
