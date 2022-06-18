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
} from 'renderer/TitleBar/store/reducers/Tabs';

import { TopBarProps } from './Types';

import './style.scss';

export const TopBar: React.FC<TopBarProps> = ({ setShowLibrary }) => {
  const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [isDarkMode, setIsDarkMode] = useState<boolean>(dark);
  const { tabs, activeTab, isRenaming } = useAppSelector((state) => state.tabs);

  const dispatch = useAppDispatch();

  const pushTab = useCallback(() => {
    const id = v4();
    const newTab = {
      id,
      label: `Board ${tabs.length + 1}`,
    };

    dispatch(addTab(newTab));
    window.bonb.tabs.select(id);
    window.bonb.analytics.event('add_board');
  }, [dispatch, tabs.length]);

  const tabOnKeyPress = (e: KeyboardEvent, id: string) => {
    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
      dispatch(setIsRenaming(null));
      dispatch(renameTab({ id, label: e.target?.value }));
    }
  };

  const switchBoard = (tabId: string) => {
    if (!isRenaming) {
      dispatch(setActiveTab(tabId));
      window.bonb.tabs.select(tabId);
      window.bonb.analytics.event('switch_board');
    }
  };

  const dblclickEventListener = useCallback(
    (tab: Element) => dispatch(setIsRenaming(tab.getAttribute('data-tabid'))),
    [dispatch]
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
        window.bonb.analytics.event('toogle_darkmode', { theme: colorScheme });
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
  }, []);

  useEffect(() => {
    if (tabs.length === 0) pushTab();
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
              onClick={() => switchBoard(t.id)}
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
        <div id="TopBar__addBoard" onClick={pushTab}>
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
          <BookmarksIcon onClick={() => setShowLibrary(true)} />
        </div>
        <div className="TopBar__menu-item">
          <AccountCircleIcon />
        </div>
      </div>
    </div>
  );
};
