/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable promise/always-return */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
import { useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';
import CloseIcon from '@mui/icons-material/Close';

import { userDb } from 'renderer/db/userDb';
import { addBoard, setActiveBoard } from 'renderer/store/reducers/Addaps';
import { useAppDispatch } from 'renderer/store/hooks';

import { BoardType } from 'renderer/components/Board/Types';
import { LibraryProps } from './Types';

import './style.css';

export const Library: React.FC<LibraryProps> = ({ closeLibrary }) => {
  const [boardsState, setBoardsState] = useState<
    { id: string; label: string; isFullSize: boolean }[]
  >([]);
  const dispatch = useAppDispatch();

  const openBoard = (b: { id: string; label: string; isFullSize: boolean }) => {
    userDb.browsers
      .where({ boardId: b.id })
      .toArray()
      .then((res) => {
        const board = {
          browsers: res,
          ...b,
        };

        dispatch(addBoard(board as BoardType));
        dispatch(setActiveBoard(b.id));
        closeLibrary();
      })
      .catch(console.log);
  };

  useEffect(() => {
    userDb.boards
      .toArray()
      .then((res) => {
        setBoardsState(res);
      })
      .catch(console.log);
  }, []);

  useEffect(() => {
    window.bonb.analytics.event('open_library');
  }, []);

  return (
    <Rnd
      id="Library__container"
      default={{
        x: window.innerWidth / 2 - 220,
        y: window.innerHeight / 2 - 300,
        width: 440,
        height: 600,
      }}
    >
      <div id="Library__close-icon" onClick={closeLibrary}>
        <CloseIcon />
      </div>

      <div id="Library__title">Boards</div>
      <div id="Library__items">
        <ul>
          {boardsState.map((b) => {
            return (
              <li key={b.id} onClick={() => openBoard(b)}>
                {b.label}
              </li>
            );
          })}
        </ul>
      </div>
    </Rnd>
  );
};
