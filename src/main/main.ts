/* eslint-disable promise/catch-or-return */
/* eslint-disable promise/no-callback-in-promise */
/* eslint-disable consistent-return */
/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, session } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import axios from 'axios';
import { machineIdSync } from 'node-machine-id';
import contextMenu from 'electron-context-menu';

import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { makeEvents } from './ipcMainEvents';
import { event } from '../renderer/helpers/analytics';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const machineId = machineIdSync();

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('b.png'),
    webPreferences: {
      webviewTag: true,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.maximize();
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();

  makeEvents(mainWindow);

  mainWindow.webContents
    .executeJavaScript(
      `localStorage.setItem("machineId", "${machineId}"); localStorage.setItem("appIsPackaged", "${app.isPackaged}");`,
      true
    )
    .then((result) => {
      console.log(result);
    });

  event('open_app');
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('web-contents-created', (_event, contents) => {
  contents.on('will-attach-webview', (_wawevent, webPreferences, _params) => {
    // Strip away preload scripts if unused or verify their location is legitimate
    // console.log(webPreferences.preload, webPreferences.preloadURL);
    webPreferences.preloadURL = `file://${__dirname}/webview-preload.js`;
    // Disable Node.js integration
    webPreferences.nodeIntegration = false;
  });

  contents.on('new-window', (e) => {
    e.preventDefault();
  });

  contextMenu({
    window: contents,
    showInspectElement: true,
    showSearchWithGoogle: false,
    showCopyImageAddress: true,
  });
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });

    session
      .fromPartition('user-partition')
      .setPermissionRequestHandler((webContents, permission, callback) => {
        const url = webContents.getURL();
        console.log(url, permission);
        callback(false);
      });
  })
  .catch(console.log);
