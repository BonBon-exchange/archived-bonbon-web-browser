/* eslint-disable react/button-has-type */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-use-before-define */
import React from 'react';
import AddIcon from '@mui/icons-material/Add';

import { ButtonAddBrowserProps } from './Types';

import './style.css';

export const ButtonAddBrowser: React.FC<ButtonAddBrowserProps> = ({
  onClick,
}) => {
  return <AddIcon id="ButtonAddBrowser" onClick={() => onClick({})} />;
};
