/* eslint-disable import/prefer-default-export */
import { useEffect } from 'react';

import './style.css';

export const Library: React.FC = () => {
  // const openBoard = (b: { id: string; label: string; isFullSize: boolean }) => {
  //   window.app.board.open(b);
  // };

  useEffect(() => {}, []);

  return <div id="Library__items" />;
};
