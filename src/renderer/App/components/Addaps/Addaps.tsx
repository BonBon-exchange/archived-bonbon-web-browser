/* eslint-disable promise/always-return */
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
import { useBoard } from 'renderer/App/hooks/useBoard';
import { userDb } from 'renderer/App/db/userDb';
import { renameBoard } from 'renderer/App/store/reducers/Board';
import { useAppDispatch } from 'renderer/App/store/hooks';

import { ContextMenuProps } from 'renderer/App/components/ContextMenu/Types';
import { AddapsProps } from './Types';

import './style.css';

export const Addaps: React.FC<AddapsProps> = ({ boardId }) => {
  useGlobalEvents();
  const { board } = useStoreHelpers({ boardId });
  const dispatch = useAppDispatch();
  const boardState = useBoard();
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

  const saveBoardAction = useCallback(() => {
    if (boardState) {
      userDb.boards.put({
        id: boardState.id,
        label: boardState.label,
        isFullSize: boardState.isFullSize,
      });
      boardState.browsers.forEach((browser) => {
        userDb.browsers.put({ boardId: boardState.id, ...browser });
      });
    }
  }, [boardState]);

  const renameBoardAction = useCallback(
    (_e: any, args: any) => {
      dispatch(renameBoard(args.label));
    },
    [dispatch]
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId]);

  useEffect(() => {
    window.app.listener.showLibrary(showLibraryAction);
    return () => window.app.off.showLibrary();
  }, [showLibraryAction]);

  useEffect(() => {
    window.app.listener.saveBoard(saveBoardAction);
    return () => window.app.off.saveBoard();
  }, [saveBoardAction]);

  useEffect(() => {
    window.app.listener.renameBoard(renameBoardAction);
    return () => window.app.off.renameBoard();
  }, [renameBoardAction]);

  return (
    <>
      <LeftBar />
      <Board />
      {showContextMenu && <ContextMenu {...contextMenuProps} />}
      {showLibrary && <Library closeLibrary={() => setShowLibrary(false)} />}
      <ReactTooltip />
    </>
  );
};
