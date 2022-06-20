/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
import React, {
  FocusEventHandler,
  KeyboardEventHandler,
  useEffect,
  useState,
} from 'react';
import TextField from '@mui/material/TextField';
import CachedIcon from '@mui/icons-material/Cached';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeIcon from '@mui/icons-material/Home';

import { updateBrowserUrl } from 'renderer/App/store/reducers/Board';
import { useAppDispatch } from 'renderer/App/store/hooks';
import { isValidHttpUrl, makeSearchUrl } from 'renderer/App/helpers/web';
import { BrowserControlBarProps } from './Types';

import './style.css';

export const BrowserControlBar: React.FC<BrowserControlBarProps> = ({
  goBack,
  goForward,
  reload,
  url,
  browserId,
  goHome,
}) => {
  const [urlInputValue, setUrlInputValue] = useState<string>(url);
  const dispatch = useAppDispatch();
  const container = document.querySelector(`#Browser__${browserId}`);

  const urlInputOnKeyPress: KeyboardEventHandler = (e) => {
    if (e.code === 'Enter' || e.code === 'NumpadEnter') {
      const target = e.target as HTMLInputElement;
      const webview = container?.querySelector(
        'webview'
      ) as Electron.WebviewTag;

      const newUrl = isValidHttpUrl(target?.value)
        ? target?.value
        : makeSearchUrl(target?.value);

      webview?.loadURL(newUrl);

      dispatch(
        updateBrowserUrl({
          url: newUrl,
          browserId,
        })
      );
    }
  };

  const onFocusInput: FocusEventHandler = (e) => {
    const target = e.target as HTMLInputElement;
    target.select();
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
        <div className="BrowserControlBar__control" onClick={goHome}>
          <HomeIcon />
        </div>
      </div>
      <TextField
        variant="standard"
        value={urlInputValue}
        className="BrowserControlBar_url-input"
        onKeyPress={urlInputOnKeyPress}
        onFocus={onFocusInput}
        onChange={(e) => setUrlInputValue(e.target.value)}
      />
    </div>
  );
};
