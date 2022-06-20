/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable promise/always-return */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
import { useEffect, useState } from 'react';

import { userDb } from 'renderer/App/db/userDb';

import './style.css';

// eslint-disable-next-line react/prop-types
export const Library: React.FC = () => {
  const [boardsState, setBoardsState] = useState<
    { id: string; label: string; isFullSize: boolean }[]
  >([]);

  const openBoard = (b: { id: string; label: string; isFullSize: boolean }) => {
    window.app.board.open(b);
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
    window.app.analytics.event('open_library');
  }, []);

  return (
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
  );
};
