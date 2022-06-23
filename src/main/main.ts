/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable promise/no-nesting */
/* eslint-disable @typescript-eslint/ban-ts-comment */
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
import fs from 'fs';
import {
  app,
  BrowserWindow,
  BrowserView,
  session,
  ipcMain,
  nativeTheme,
  WebContents,
} from 'electron';
import { machineIdSync } from 'node-machine-id';
import contextMenu from 'electron-context-menu';
import { ElectronChromeExtensions } from 'electron-chrome-extensions';

import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { makeEvents } from './ipcMainEvents';
import { event } from './analytics';

const machineId = machineIdSync();
const appVersion = app.getVersion();

Nucleus.init('62aaf235a3310eb923a238e2');
Nucleus.setUserId(machineId);
Nucleus.setProps(
  {
    app_version: appVersion,
    version: appVersion,
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
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const views: Record<string, BrowserView> = {};
let selectedView: BrowserView;
let extensions: ElectronChromeExtensions;
const browsers: Record<string, WebContents> = {};

const createBrowserView = () => {
  const sizes = mainWindow?.getSize();
  const width = sizes && sizes[0] ? sizes[0] : 0;
  const height = sizes && sizes[1] ? sizes[1] : 0;
  const view = new BrowserView({
    webPreferences: {
      partition: 'persist:user-partition',
      sandbox: true,
      webviewTag: true,
      safeDialogs: true,
      preload: app.isPackaged
        ? path.join(__dirname, 'appPreload.js')
        : path.join(__dirname, '../../.erb/dll/app.preload.js'),
    },
  });

  view.setBounds({ x: 0, y: 30, width, height: height - 30 });
  view.setAutoResize({ width: true, height: true });
  view.webContents.loadURL(resolveHtmlPath('index.html'));

  if (!app.isPackaged) view.webContents.toggleDevTools();
  if (mainWindow) extensions.addTab(view.webContents, mainWindow);
  view.webContents.focus();
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
      partition: 'persist:user-partition',
      sandbox: true,
      preload: app.isPackaged
        ? path.join(__dirname, 'titleBarPreload.js')
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

  mainWindow.on('focus', () => {
    if (selectedView) selectedView.webContents.focus();
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  makeEvents();

  ipcMain.on('tab-select', (_event, args) => {
    const viewToShow: BrowserView = views[args.tabId]
      ? views[args.tabId]
      : createBrowserView();
    views[args.tabId] = viewToShow;
    viewToShow.webContents.on('dom-ready', () =>
      viewToShow.webContents.send('load-board', { boardId: args.tabId })
    );
    mainWindow?.setBrowserView(viewToShow);
    selectedView = viewToShow;
    selectedView.webContents.focus();
  });

  ipcMain.on('open-board', (_event, args) => {
    mainWindow?.webContents.send('open-tab', args);

    const viewToShow: BrowserView = views[args.boardId]
      ? views[args.boardId]
      : createBrowserView();
    views[args.boardId] = viewToShow;
    viewToShow.webContents.on('dom-ready', () => {
      viewToShow.webContents.send('load-board', { boardId: args.id });
    });
    mainWindow?.setBrowserView(viewToShow);
    selectedView = viewToShow;
    selectedView.webContents.focus();
  });

  ipcMain.on('close-active-board', () => {
    mainWindow?.webContents.send('close-active-tab');
  });

  ipcMain.on('show-library', () => {
    selectedView.webContents.send('show-library');
  });

  ipcMain.on('show-settings', () => {
    selectedView.webContents.send('show-settings');
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
      selectedView = views[viewsKeys[viewsKeys.length - 1]];
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
    extensions.selectTab(selectedView.webContents);
  });

  mainWindow.webContents.executeJavaScript(
    `localStorage.setItem("machineId", "${machineId}"); localStorage.setItem("appIsPackaged", "${app.isPackaged}");`,
    true
  );

  event('open_app');
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    event('close_app');
    app.quit();
  }
});

app.on('web-contents-created', (_event, contents) => {
  contents.on('new-window', (e, url) => {
    e.preventDefault();
    selectedView.webContents.send('new-window', { url });
  });

  contents.on('will-attach-webview', (wawevent, _webPreferences, _params) => {
    const pathToPreloadScipt = app.isPackaged
      ? path.join(__dirname, '../../../assets/webview-preload.js')
      : path.join(__dirname, '../../assets/webview-preload.js');
    // @ts-ignore
    wawevent.sender.session.setPreloads([`${pathToPreloadScipt}`]);
  });

  contents.on('did-attach-webview', (_daw, webContents) => {
    browsers[webContents.id] = webContents;
    webContents.addListener('did-start-loading', () => {
      webContents.send('created-webcontents', {
        webContentsId: webContents.id,
      });
    });
    if (mainWindow) extensions.addTab(webContents, mainWindow);
  });

  contextMenu({
    prepend: (_defaultActions, params, _browserWindow) => [
      // App context menu below
      {
        label: 'Close',
        visible: params.y > 30 && params.x < 50,
        click: () => {
          selectedView?.webContents.send('close-webview', {
            x: params.x,
            y: params.y,
          });
        },
      },
      {
        label: 'Close all',
        visible: params.y > 30 && params.x < 50,
        click: () => {
          selectedView?.webContents.send('close-all-webview');
        },
      },

      // TitleBar context menu below
      {
        label: 'Close',
        visible: params.y <= 30,
        click: () => {
          mainWindow?.webContents.send('close-tab', {
            x: params.x,
            y: params.y,
          });
        },
      },
      {
        label: 'Rename',
        visible: params.y <= 30,
        click: () => {
          mainWindow?.webContents.send('rename-tab', {
            x: params.x,
            y: params.y,
          });
        },
      },
      {
        label: 'Save',
        visible: params.y <= 30,
        click: () => {
          mainWindow?.webContents.send('save-board', {
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
    extensions = new ElectronChromeExtensions({
      session: session.fromPartition('persist:user-partition'),
      modulePath: app.isPackaged
        ? path.join(
            __dirname,
            '../../../node_modules/electron-chrome-extensions'
          )
        : undefined,
      createTab(details) {
        return new Promise((resolve, reject) => {
          selectedView.webContents.send('new-window', { url: details.url });
          if (mainWindow) resolve([selectedView.webContents, mainWindow]);
          else reject(new Error('mainWindow is null'));
        });
      },
      removeTab(tab, browserWindow) {
        // Optionally implemented for chrome.tabs.remove support
        // console.log('remove tab', tab, browserWindow);
        return new Error('removeTab is not implemented yet.');
      },
      createWindow(details) {
        return new Promise((resolve, reject) => {
          reject(new Error('createWindow es not implemented yet.'));
        });
      },
      removeWindow(details) {
        // console.log('remove window', details);
        return new Error('removeWindow is not implemented yet.');
      },
      assignTabDetails(details, tab) {
        // console.log('assign details', details, tab);
        return new Error('assignTabDetails is not implemented yet.');
      },
    });

    createWindow().then(() => {
      session
        .fromPartition('persist:user-partition')
        .setPermissionRequestHandler((webContents, permission, callback) => {
          const url = webContents.getURL();
          console.log(url, permission);
          url === 'http://localhost:1212/index.html'
            ? callback(true)
            : callback(false);
        });

      if (mainWindow) {
        extensions.addTab(mainWindow.webContents, mainWindow);
        extensions.selectTab(mainWindow.webContents);
      }

      if (!app.isPackaged)
        mainWindow?.webContents.openDevTools({ mode: 'detach' });
    });

    const forcedExtensionsPath = app.isPackaged
      ? path.join(__dirname, '../../../assets/extensions')
      : path.join(__dirname, '../../assets/extensions');

    const userExtensionsPath = path.join(app.getPath('userData'), 'extensions');

    const loadExtensions = (folderPath: string) => {
      fs.readdirSync(folderPath, { withFileTypes: true })
        .filter((item: any) => item.isDirectory())
        .map((item: any) => item.name)
        .forEach((dir) => {
          const extPath = path.join(folderPath, dir);
          session
            .fromPartition('persist:user-partition')
            .loadExtension(extPath);
        });
    };

    loadExtensions(forcedExtensionsPath);
    loadExtensions(userExtensionsPath);

    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
