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
import {
  setBoards,
  setActiveBoard,
  setIsRenamingBoard,
  renameBoard,
} from 'renderer/store/reducers/Addaps';

import { TopBarProps } from './Types';

import './style.scss';

export const TopBar: React.FC<TopBarProps> = ({ setShowLibrary }) => {
  const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [isDarkMode, setIsDarkMode] = useState<boolean>(dark);
  const { boards, isRenamingBoard, activeBoard } = useAppSelector(
    (state) => state.addaps
  );
  const dispatch = useAppDispatch();

  const addBoard = () => {
    const id = v4();
    const newBoard = {
      id,
      label: `Board ${boards.length + 1}`,
      browsers: [],
      isFullSize: false,
    };

    const editedBoards = [...boards, newBoard];
    dispatch(setBoards(editedBoards));
    dispatch(setActiveBoard(id));
    window.bonb.analytics.event('add_board');
  };

  const tabOnKeyPress = (e: KeyboardEvent, boardId: string) => {
    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
      dispatch(setIsRenamingBoard(null));
      dispatch(renameBoard({ boardId, label: e.target?.value }));
    }
  };

  const switchBoard = (boarId: string) => {
    if (!isRenamingBoard) {
      dispatch(setActiveBoard(boarId));
      window.bonb.analytics.event('switch_board');
    }
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
        {boards.map((b) => {
          return (
            <div
              className={clsx({
                TopBar__tab: true,
                bold: activeBoard === b.id,
              })}
              key={b.id}
              onClick={() => switchBoard(b.id)}
              data-boardid={b.id}
            >
              {isRenamingBoard === b.id ? (
                <TextField
                  label="Board name"
                  defaultValue={b.label}
                  variant="standard"
                  onKeyPress={(e) => tabOnKeyPress(e, b.id)}
                />
              ) : (
                b.label
              )}
            </div>
          );
        })}
        <div id="TopBar__addBoard" onClick={addBoard}>
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
