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
    window.gtag('config', 'G-PDRJCJWQYM');
    window.gtag('event', 'load_app');
  }, []);

  return (
    <>
      <TopBar />
      <LeftBar />
      <Board />
      {showContextMenu && <ContextMenu {...contextMenuProps} />}
    </>
  );
};
