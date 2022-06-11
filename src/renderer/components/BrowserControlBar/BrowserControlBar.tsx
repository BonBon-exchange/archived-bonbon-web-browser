/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import CachedIcon from '@mui/icons-material/Cached';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { BrowserControlBarProps } from './Types';

import './style.css';

export const BrowserControlBar: React.FC<BrowserControlBarProps> = ({
  goBack,
  goForward,
  reload,
  url,
  browserId,
}) => {
  const [urlInputValue, setUrlInputValue] = useState<string>(url);

  const urlInputOnKeyPress = (e: KeyboardEvent) => {
    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
      document
        .querySelector(`#Browser__${browserId}`)
        ?.querySelector('webview')
        ?.loadURL(e.target?.value);
    }
  };

  useEffect(() => {
    setUrlInputValue(url);
  }, [url]);

  return (
    <div className="BrowserControlBar__container">
      <div className="BrowserControlBar__controls">
        <div className="BrowserControlBar__control" onClick={goBack}>
          <ArrowBackIcon />
        </div>
        <div className="BrowserControlBar__control" onClick={goForward}>
          <ArrowForwardIcon />
        </div>
        <div className="BrowserControlBar__control" onClick={reload}>
          <CachedIcon />
        </div>
      </div>
      <TextField
        label="Url"
        variant="standard"
        value={urlInputValue}
        className="BrowserControlBar_url-input"
        onKeyPress={urlInputOnKeyPress}
        onChange={(e) => setUrlInputValue(e.target.value)}
      />
    </div>
  );
};
