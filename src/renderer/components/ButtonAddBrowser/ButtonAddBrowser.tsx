/* eslint-disable react/button-has-type */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import React from 'react';

import { ButtonAddBrowserProps } from './Types';

import './style.css';

export const ButtonAddBrowser: React.FC<ButtonAddBrowserProps> = ({
  onClick,
}) => {
  return (
    <button id="ButtonAddBrowser" onClick={onClick}>
      Add browser
    </button>
  );
};
