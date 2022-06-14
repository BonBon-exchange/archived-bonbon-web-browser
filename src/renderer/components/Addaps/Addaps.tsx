/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react';

import { TopBar } from '../TopBar';
import { Board } from '../Board';
import { LeftBar } from '../LeftBar';
import { ContextMenu } from '../ContextMenu';
import { Library } from '../Library';

import { ContextMenuProps } from '../ContextMenu/Types';

import './style.css';
import 'renderer/style/dark.css';
import 'renderer/style/light.css';

export const Addaps: React.FC = () => {
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const [showLibrary, setShowLibrary] = useState<boolean>(false);
  const [contextMenuProps, setContextMenuProps] = useState<ContextMenuProps>({
    x: 0,
    y: 0,
    target: null,
  });

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

    window.addEventListener('scroll', (e) => {
      const containerHeight =
        document.querySelector('.Board__container')?.clientHeight;
      const heightDistance =
        document.documentElement.getBoundingClientRect().bottom * -1 +
        window.innerHeight -
        30;
      if (Number(containerHeight) - heightDistance < 100) {
        document.querySelector('.Board__container').style.height = `${
          Number(containerHeight) + 100
        }px`;
      }
    });
  }, []);

  useEffect(() => {
    window.bonb.analytics.event('load_app');
  }, []);

  return (
    <>
      <TopBar setShowLibrary={setShowLibrary} />
      <LeftBar />
      <Board />
      {showContextMenu && <ContextMenu {...contextMenuProps} />}
      {showLibrary && <Library closeLibrary={() => setShowLibrary(false)} />}
    </>
  );
};
