/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import React from 'react';

import { TopBar } from '../TopBar';
import { Board } from '../Board';

import './style.css';

export const Addaps: React.FC = () => {
  return (
    <>
      <TopBar />
      <Board />
    </>
  );
};
