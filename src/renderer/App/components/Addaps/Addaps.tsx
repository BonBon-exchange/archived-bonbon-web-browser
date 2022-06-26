/* eslint-disable promise/always-return */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import React, { useCallback, useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';

import { useGlobalEvents } from 'renderer/App/hooks/useGlobalEvents';
import { Board } from 'renderer/App/components/Board';
import { LeftBar } from 'renderer/App/components/LeftBar';
import { Library } from 'renderer/App/components/Library';
import { Settings } from 'renderer/App/components/Settings';
import { Popup } from 'renderer/App/components/Popup';
import { useStoreHelpers } from 'renderer/App/hooks/useStoreHelpers';
import { renameBoard } from 'renderer/App/store/reducers/Board';
import { useAppDispatch } from 'renderer/App/store/hooks';

import { AddapsProps } from './Types';

import './style.css';

export const Addaps: React.FC<AddapsProps> = ({ boardId }) => {
  useGlobalEvents();
  const { board } = useStoreHelpers({ boardId });
  const dispatch = useAppDispatch();
  // const boardState = useBoard();
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupTitle, setPopupTitle] = useState<string>('');
  const [popupChildren, setPopupChildren] = useState<JSX.Element>();

  const showLibraryAction = useCallback(() => {
    setPopupChildren(<Library />);
    setPopupTitle('Library');
    setShowPopup(!showPopup);
    window.app.analytics.event('open_library');
  }, [showPopup]);

  const showSettingsAction = useCallback(() => {
    setPopupChildren(<Settings />);
    setPopupTitle('Settings');
    setShowPopup(!showPopup);
    window.app.analytics.event('open_settings');
  }, [showPopup]);

  const saveBoardAction = useCallback(() => {}, []);

  const renameBoardAction = useCallback(
    (_e: any, args: any) => {
      dispatch(renameBoard(args.label));
    },
    [dispatch]
  );

  useEffect(() => {
    if (boardId) board.load({ id: boardId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId]);

  useEffect(() => {
    window.app.listener.showLibrary(showLibraryAction);
    return () => window.app.off.showLibrary();
  }, [showLibraryAction]);

  useEffect(() => {
    window.app.listener.showSettings(showSettingsAction);
    return () => window.app.off.showSettings();
  }, [showSettingsAction]);

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
      <ReactTooltip />
      {showPopup && (
        <Popup title={popupTitle} closePopup={() => setShowPopup(false)}>
          {popupChildren}
        </Popup>
      )}
    </>
  );
};
