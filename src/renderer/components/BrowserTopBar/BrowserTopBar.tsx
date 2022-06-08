/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import React from 'react';

import './style.css';
import { BrowserTopBarProps } from './Types';

export const BrowserTopBar: React.FC<BrowserTopBarProps> = ({
  closeBrowser,
  toggleFullsizeBrowser,
  title,
}) => {
  return (
    <div className="BrowserTopBar__container">
      <div className="BrowserTopBar__title">{title}</div>
      <div className="BrowserTopBar__controls">
        <div className="BrowserTopBar__control-button" onClick={closeBrowser}>
          x
        </div>
        <div
          className="BrowserTopBar__control-button"
          onClick={toggleFullsizeBrowser}
        >
          o
        </div>
      </div>
    </div>
  );
};
