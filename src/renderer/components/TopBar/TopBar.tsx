/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from 'react';
import { v4 } from 'uuid';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import clsx from 'clsx';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

import { useAppDispatch, useAppSelector } from 'renderer/store/hooks';
import { addTab, setActiveTab } from 'renderer/store/reducers/Tabs';

import { TopBarProps } from './Types';

import './style.scss';

export const TopBar: React.FC<TopBarProps> = ({ setShowLibrary }) => {
  const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [isDarkMode, setIsDarkMode] = useState<boolean>(dark);
  const { tabs, activeTab } = useAppSelector((state) => state.tabs);

  const dispatch = useAppDispatch();

  const pushTab = () => {
    const id = v4();
    const newTab = {
      id,
      label: `Board ${tabs.length + 1}`,
    };

    dispatch(addTab(newTab));

    window.bonb.analytics.event('add_board');
  };

  // const tabOnKeyPress = (e: KeyboardEvent, boardId: string) => {
  //   if (e.code === 'Enter' || e.code === 'NumpadEnter') {
  //     dispatch(setIsRenamingBoard(null));
  //     dispatch(renameBoard({ boardId, label: e.target?.value }));
  //   }
  // };

  const switchBoard = (tabId: string) => {
    // if (!isRenamingBoard) {
    dispatch(setActiveTab(tabId));
    window.bonb.tabs.select(tabId);
    window.bonb.analytics.event('switch_board');
    // }
  };

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
              data-boardid={t.id}
            >
              {/* {isRenamingBoard === b.id ? (
                <TextField
                  label="Board name"
                  defaultValue={b.label}
                  variant="standard"
                  onKeyPress={(e) => tabOnKeyPress(e, b.id)}
                />
              ) : (
                b.label
              )} */}

              {t.label}
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
