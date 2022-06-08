/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import React from 'react';
import { v4 } from 'uuid';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setBoards, setActiveBoard } from '../../store/reducers/Addaps';

import './style.css';

export const TopBar: React.FC = () => {
  const { boards } = useAppSelector((state) => state.addaps);
  const dispatch = useAppDispatch();

  const addBoard = () => {
    const id = v4();
    const newBoard = {
      id,
      label: 'New board',
      browsers: [],
    };

    const editedBoards = [...boards, newBoard];
    dispatch(setBoards(editedBoards));
    dispatch(setActiveBoard(id));
  };

  return (
    <div id="TopBar__container">
      <div id="TopBar__addBoard" onClick={addBoard}>
        +
      </div>
      {boards.map((b) => {
        return (
          <div
            className="TopBar__tab"
            key={b.id}
            onClick={() => dispatch(setActiveBoard(b.id))}
          >
            {b.label}
          </div>
        );
      })}
    </div>
  );
};
