/* eslint-disable promise/always-return */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
import { useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';
import CloseIcon from '@mui/icons-material/Close';

import { userDb } from 'renderer/db/userDb';

import { LibraryProps } from './Types';

import './style.css';

export const Library: React.FC<LibraryProps> = ({ closeLibrary }) => {
  const [boards, setBoards] = useState<{ id: string; label: string }[]>([]);

  useEffect(() => {
    userDb.boards
      .toArray()
      .then((res) => {
        setBoards(res);
      })
      .catch(console.log);
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
          {boards.map((b) => {
            return <li key={b.id}>{b.label}</li>;
          })}
        </ul>
      </div>
    </Rnd>
  );
};
