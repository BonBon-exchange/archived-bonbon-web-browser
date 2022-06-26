/* eslint-disable import/prefer-default-export */
import { app, BrowserView, ipcMain, nativeTheme, WebContents } from 'electron';

import { getExtensionsObject } from './extensions';
import { event } from './analytics';
import {
  createBrowserView,
  getMainWindow,
  getSelectedView,
  setSelectedView,
} from './browser';

const views: Record<string, BrowserView> = {};
const browsers: Record<string, WebContents> = {};

export const getBrowsers = () => browsers;

export const makeIpcMainEvents = (): void => {
  const extensions = getExtensionsObject();
  ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light';
    } else {
      nativeTheme.themeSource = 'dark';
    }
    return nativeTheme.shouldUseDarkColors;
  });

  ipcMain.handle('dark-mode:system', () => {
    nativeTheme.themeSource = 'system';
  });

  ipcMain.on('inspectElement', (e, args) => {
    e.sender.inspectElement(args.x, args.y);
  });

  ipcMain.on('analytics', (_event, args) => {
    event(args.eventName, args.params);
  });

  ipcMain.on('tab-select', (_event, args) => {
    const viewToShow: BrowserView = views[args.tabId]
      ? views[args.tabId]
      : createBrowserView();
    views[args.tabId] = viewToShow;
    getMainWindow()?.setTopBrowserView(viewToShow);
    viewToShow.webContents.on('dom-ready', () =>
      viewToShow.webContents.send('load-board', { boardId: args.tabId })
    );
    setSelectedView(viewToShow);
    getSelectedView().webContents.focus();
  });

  ipcMain.on('open-board', (_event, args) => {
    getMainWindow()?.webContents.send('open-tab', args);

    const viewToShow: BrowserView = views[args.boardId]
      ? views[args.boardId]
      : createBrowserView();
    views[args.boardId] = viewToShow;
    getMainWindow()?.setTopBrowserView(viewToShow);
    viewToShow.webContents.on('dom-ready', () => {
      viewToShow.webContents.send('load-board', { boardId: args.id });
    });
    setSelectedView(viewToShow);
    getSelectedView().webContents.focus();
  });

  ipcMain.on('close-active-board', () => {
    getMainWindow()?.webContents.send('close-active-tab');
  });

  ipcMain.on('show-library', () => {
    getSelectedView().webContents.send('show-library');
  });

  ipcMain.on('show-settings', () => {
    getSelectedView().webContents.send('show-settings');
  });

  ipcMain.on('tab-purge', (_event, args) => {
    const view = views[args.tabId];
    if (view) view.webContents.send('purge');
    delete views[args.tabId];
    const viewsKeys = Object.keys(views);
    if (viewsKeys.length === 0) {
      event('close_app');
      app.quit();
    } else {
      setSelectedView(views[viewsKeys[viewsKeys.length - 1]]);
    }
  });

  ipcMain.on('save-tab', (_event, args) => {
    const view = views[args.tabId];
    if (view) view.webContents.send('save-board');
  });

  ipcMain.on('rename-tab', (_event, args) => {
    const view = views[args.tabId];
    if (view) view.webContents.send('rename-board', { label: args.label });
  });

  ipcMain.on('select-browser', (_event, webContentsId) => {
    if (browsers[webContentsId]) extensions.selectTab(browsers[webContentsId]);
  });

  ipcMain.on('select-browserView', () => {
    extensions.selectTab(getSelectedView().webContents);
  });

  ipcMain.on('select-next-board', () => {
    getMainWindow()?.webContents.send('select-next-board');
  });
};
