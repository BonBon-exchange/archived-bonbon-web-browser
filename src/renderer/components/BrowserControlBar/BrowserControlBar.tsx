/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
import React from 'react';

import { BrowserControlBarProps } from './Types';

import './style.css';

export const BrowserControlBar: React.FC<BrowserControlBarProps> = ({
  goBack,
  goForward,
}) => {
  return (
    <div className="BrowserControlBar__container">
      <div className="BrowserControlBar__controls">
        <div className="BrowserControlBar__control" onClick={goBack}>
          {'<'}
        </div>
        <div className="BrowserControlBar__control" onClick={goForward}>
          {'>'}
        </div>
      </div>
    </div>
  );
};
