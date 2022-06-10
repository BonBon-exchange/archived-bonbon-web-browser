/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react';

import { TopBar } from '../TopBar';
import { Board } from '../Board';
import { LeftBar } from '../LeftBar';
import { ContextMenu } from '../ContextMenu';

import './style.css';
import { ContextMenuProps } from '../ContextMenu/Types';

export const Addaps: React.FC = () => {
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const [contextMenuProps, setContextMenuProps] = useState<ContextMenuProps>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    window.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      setContextMenuProps({
        x: e.x,
        y: e.y,
      });
      setShowContextMenu(true);
    });

    window.addEventListener('click', () => setShowContextMenu(false));
  });

  return (
    <>
      <TopBar />
      <LeftBar />
      <Board />
      {showContextMenu && <ContextMenu {...contextMenuProps} />}
    </>
  );
};
