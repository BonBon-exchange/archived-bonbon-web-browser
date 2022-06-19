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
import Nucleus from 'nucleus-nodejs';
import {
  app,
  BrowserWindow,
  BrowserView,
  shell,
  session,
  ipcMain,
  nativeTheme,
} from 'electron';
import { machineIdSync } from 'node-machine-id';
import contextMenu from 'electron-context-menu';

import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { makeEvents } from './ipcMainEvents';
import { event } from './analytics';

Nucleus.init('62aaf235a3310eb923a238e2');
Nucleus.setUserId(machineIdSync());
Nucleus.setProps(
  {
    version: app.getVersion(),
    app_is_packaged: app.isPackaged,
  },
  true
);

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

const views = {};
let selectedView = null;

const createBrowserView = (sizes: [width: number, height: number]) => {
  const [width, height] = sizes;
  const view = new BrowserView({
    webPreferences: {
      webviewTag: true,
      preload: app.isPackaged
        ? path.join(__dirname, 'app.preload.js')
        : path.join(__dirname, '../../.erb/dll/app.preload.js'),
    },
  });

  view.setBounds({ x: 0, y: 30, width, height: height - 30 });
  view.setAutoResize({ width: true, height: true });
  view.webContents.loadURL(resolveHtmlPath('index.html'));
  if (!app.isPackaged) view.webContents.toggleDevTools();
  return view;
};

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
    icon: getAssetPath('icon.png'),
    titleBarStyle: 'hidden',
    titleBarOverlay: true,
    webPreferences: {
      webviewTag: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'titleBar.preload.js')
        : path.join(__dirname, '../../.erb/dll/titleBar.preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('titleBar.html'));

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

  makeEvents(mainWindow);

  ipcMain.on('tab-select', (_event, args) => {
    const sizes = mainWindow?.getSize();
    const viewToShow: BrowserView = views[args.tabId]
      ? views[args.tabId]
      : createBrowserView(sizes);
    views[args.tabId] = viewToShow;
    viewToShow.webContents.on('dom-ready', () =>
      viewToShow.webContents.send('load-board', { boardId: args.tabId })
    );
    mainWindow?.setBrowserView(viewToShow);
    selectedView = viewToShow;
  });

  ipcMain.on('open-board', (_event, args) => {
    mainWindow?.webContents.send('open-tab', args);

    const sizes = mainWindow?.getSize();
    const viewToShow: BrowserView = views[args.boardId]
      ? views[args.boardId]
      : createBrowserView(sizes);
    views[args.boardId] = viewToShow;
    viewToShow.webContents.on('dom-ready', () => {
      viewToShow.webContents.send('load-board', { boardId: args.id });
      viewToShow.webContents.send('open-board', args);
    });
    mainWindow?.setBrowserView(viewToShow);
    selectedView = viewToShow;
  });

  ipcMain.on('show-library', () => {
    selectedView.webContents.send('show-library');
  });

  ipcMain.on('tab-purge', (_event, args) => {
    const view = views[args.tabId];
    if (view) view.webContents.send('purge');
    delete views[args.tabId];
  });

  mainWindow.webContents.executeJavaScript(
    `localStorage.setItem("machineId", "${machineId}"); localStorage.setItem("appIsPackaged", "${app.isPackaged}");`,
    true
  );

  event('open_app');
  // mainWindow.webContents.openDevTools({ mode: 'detach' });
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  event('close_app');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('web-contents-created', (_event, contents) => {
  contents.on('will-attach-webview', (_wawevent, webPreferences, _params) => {
    const pathToPreloadScipt = app.isPackaged
      ? path.join(__dirname, '../../../assets/webview-preload.js')
      : path.join(__dirname, '../../assets/webview-preload.js');
    // Strip away preload scripts if unused or verify their location is legitimate
    // console.log(webPreferences.preload, webPreferences.preloadURL);
    webPreferences.preloadURL = `file://${pathToPreloadScipt}`;
    // Disable Node.js integration
    webPreferences.nodeIntegration = false;
  });

  contents.on('new-window', (e, url) => {
    e.preventDefault();
    mainWindow?.webContents.send('new-window', { url });
  });

  contextMenu({
    prepend: (defaultActions, params, browserWindow) => [
      {
        label: 'Close',
        visible: params.y <= 30,
        click: () => {
          mainWindow.webContents.send('close-tab', {
            x: params.x,
            y: params.y,
          });
        },
      },
      {
        label: 'Rename',
        visible: params.y <= 30,
        click: () => {
          mainWindow.webContents.send('rename-tab', {
            x: params.x,
            y: params.y,
          });
        },
      },
      {
        type: 'separator',
      },
    ],
    window: contents,
    showInspectElement: true,
    showSearchWithGoogle: false,
    showCopyImageAddress: true,
  });
});

app
  .whenReady()
  .then(() => {
    Nucleus.appStarted();
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
