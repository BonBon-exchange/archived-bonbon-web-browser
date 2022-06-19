/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import React, { useState, useEffect, useCallback } from 'react';
import { v4 } from 'uuid';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import clsx from 'clsx';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import { useAppDispatch, useAppSelector } from 'renderer/TitleBar/store/hooks';
import {
  addTab,
  setActiveTab,
  setIsRenaming,
  renameTab,
  removeTab,
} from 'renderer/TitleBar/store/reducers/Tabs';

import './style.scss';

export const TopBar: React.FC = () => {
  const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [isDarkMode, setIsDarkMode] = useState<boolean>(dark);
  const { tabs, activeTab, isRenaming } = useAppSelector((state) => state.tabs);

  const dispatch = useAppDispatch();

  const pushTab = useCallback(
    (params: { id?: string; label?: string }) => {
      const id = params.id || v4();
      const newTab = {
        id,
        label: params.label || `Board ${tabs.length + 1}`,
      };

      dispatch(addTab(newTab));
      window.titleBar.tabs.select(id);
      window.titleBar.analytics.event('add_board');
    },
    [dispatch, tabs.length]
  );

  const tabOnKeyPress = (e: KeyboardEvent, id: string) => {
    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
      dispatch(setIsRenaming(null));
      dispatch(renameTab({ id, label: e.target?.value }));
      window.titleBar.tabs.rename({ tabId: id, label: e.target?.value });
    }
  };

  const switchBoard = useCallback(
    (tabId: string) => {
      if (!isRenaming) {
        window.titleBar.tabs.select(tabId);
        window.titleBar.analytics.event('switch_board');
      }
    },
    [isRenaming]
  );

  const dblclickEventListener = useCallback(
    (tab: Element) => dispatch(setIsRenaming(tab.getAttribute('data-tabid'))),
    [dispatch]
  );

  const showLibrary = () => {
    window.titleBar.screens.library();
  };

  const openTabListener = useCallback(
    (_e: any, args: { id?: string; label?: string }) => {
      if (tabs?.find((t) => t.id === args?.id)) {
        switchBoard(args.id);
      } else {
        pushTab(args);
      }
    },
    [pushTab, switchBoard, tabs]
  );

  const closeTabListener = useCallback(
    (_e: any, args: { x: number; y: number }) => {
      const el = document.elementFromPoint(args.x, args.y);
      const tabId = el?.getAttribute('data-tabid');
      if (tabId) {
        dispatch(removeTab(tabId));
        window.titleBar.tabs.purge(tabId);
      }
    },
    [dispatch]
  );

  const renameTabListener = useCallback(
    (_e: any, args: { x: number; y: number }) => {
      const el = document.elementFromPoint(args.x, args.y);
      const tabId = el?.getAttribute('data-tabid');
      if (tabId) {
        dispatch(setIsRenaming(tabId));
      }
    },
    [dispatch]
  );

  const saveBoardListener = useCallback(
    (_e: any, args: { x: number; y: number }) => {
      const el = document.elementFromPoint(args.x, args.y);
      const tabId = el?.getAttribute('data-tabid');
      if (tabId) {
        window.titleBar.tabs.save(tabId);
      }
    },
    []
  );

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
        setIsDarkMode(e.matches);
        window.document.querySelector('body').className = colorScheme;
        window.titleBar.analytics.event('toogle_darkmode', {
          theme: colorScheme,
        });
      });
  }, []);

  useEffect(() => {
    document.querySelectorAll('.TopBar__tab').forEach((tab) => {
      tab.addEventListener('dblclick', (e) => dblclickEventListener(tab));
    });
    return () =>
      document.querySelectorAll('.TopBar__tab').forEach((tab) => {
        tab.removeEventListener('dblclick', (e) => dblclickEventListener(tab));
      });
  }, [dblclickEventListener]);

  useEffect(() => {
    switchBoard(activeTab);
  }, [switchBoard, activeTab]);

  useEffect(() => {
    window.titleBar.listener.openTab(openTabListener);
    return () => window.titleBar.off.openTab();
  }, [openTabListener]);

  useEffect(() => {
    window.titleBar.listener.closeTab(closeTabListener);
    return () => window.titleBar.off.closeTab();
  }, [closeTabListener]);

  useEffect(() => {
    window.titleBar.listener.renameTab(renameTabListener);
    return () => window.titleBar.off.renameTab();
  }, [renameTabListener]);

  useEffect(() => {
    window.titleBar.listener.saveBoard(saveBoardListener);
    return () => window.titleBar.off.saveBoard();
  }, [saveBoardListener]);

  useEffect(() => {
    if (tabs.length === 0) pushTab({});
  }, [tabs, pushTab]);

  return (
    <div id="TopBar__container">
      <div id="TopBar__tabs-container">
        {tabs.map((t) => {
          return (
            <div
              className={clsx({
                TopBar__tab: true,
                bold: activeTab === t.id,
              })}
              key={t.id}
              onClick={() => dispatch(setActiveTab(t.id))}
              data-tabid={t.id}
            >
              {isRenaming === t.id ? (
                <TextField
                  label="Board name"
                  defaultValue={t.label}
                  variant="standard"
                  onKeyPress={(e) => tabOnKeyPress(e, t.id)}
                />
              ) : (
                t.label
              )}
            </div>
          );
        })}
        <div id="TopBar__addBoard" onClick={() => pushTab({})}>
          <AddIcon />
        </div>
      </div>
      <div id="TopBar__menu-container">
        <div className="TopBar__menu-item">
          {isDarkMode ? (
            <Brightness7Icon onClick={() => window.darkMode.toggle()} />
          ) : (
            <Brightness4Icon onClick={() => window.darkMode.toggle()} />
          )}
        </div>
        <div className="TopBar__menu-item">
          <BookmarksIcon onClick={showLibrary} />
        </div>
        <div className="TopBar__menu-item">
          <AccountCircleIcon />
        </div>
      </div>
    </div>
  );
};
