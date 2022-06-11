/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import React from 'react';
import { v4 } from 'uuid';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import clsx from 'clsx';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  setBoards,
  setActiveBoard,
  setIsRenamingBoard,
  renameBoard,
} from '../../store/reducers/Addaps';

import './style.css';

export const TopBar: React.FC = () => {
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
    };

    const editedBoards = [...boards, newBoard];
    dispatch(setBoards(editedBoards));
    dispatch(setActiveBoard(id));
    window.gtag('event', 'add_board');
  };

  const tabOnKeyPress = (e: KeyboardEvent, boardId: string) => {
    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
      dispatch(setIsRenamingBoard(null));
      dispatch(renameBoard({ boardId, label: e.target?.value }));
    }
  };

  return (
    <div id="TopBar__container">
      {boards.map((b) => {
        return (
          <div
            className="TopBar__tab"
            key={b.id}
            onClick={() => !isRenamingBoard && dispatch(setActiveBoard(b.id))}
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
              <span className={clsx({ bold: activeBoard === b.id })}>
                {b.label}
              </span>
            )}
          </div>
        );
      })}
      <div id="TopBar__addBoard" onClick={addBoard}>
        <AddIcon />
      </div>
    </div>
  );
};
