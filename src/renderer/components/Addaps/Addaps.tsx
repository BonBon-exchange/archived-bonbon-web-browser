/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';

import { useGlobalEvents } from 'renderer/hooks/useGlobalEvents';
// import { TopBar } from 'renderer/components/TopBar';
import { Board } from 'renderer/components/Board';
import { LeftBar } from 'renderer/components/LeftBar';
import { ContextMenu } from 'renderer/components/ContextMenu';
import { Library } from 'renderer/components/Library';

import { ContextMenuProps } from 'renderer/components/ContextMenu/Types';

import './style.css';
import 'renderer/style/dark.css';
import 'renderer/style/light.css';

export const Addaps: React.FC = () => {
  useGlobalEvents();
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
  }, []);

  useEffect(() => {
    window.bonb.analytics.event('load_app');
  }, []);

  useEffect(() => {
    window.document.querySelector('body').className = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches
      ? 'dark-theme'
      : 'light-theme';

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        const colorScheme = e.matches ? 'dark-theme' : 'light-theme';
        window.document.querySelector('body').className = colorScheme;
        window.bonb.analytics.event('toogle_darkmode', { theme: colorScheme });
      });
  }, []);

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
