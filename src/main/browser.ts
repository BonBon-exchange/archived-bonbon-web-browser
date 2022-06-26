/* eslint-disable import/no-cycle */
import { BrowserView, BrowserWindow, app } from 'electron';
import path from 'path';
import { machineIdSync } from 'node-machine-id';

import { getExtensionsObject, installDevtoolsExtensions } from './extensions';
import { resolveHtmlPath } from './util';
import { event } from './analytics';

const machineId = machineIdSync();

let selectedView: BrowserView;
let mainWindow: BrowserWindow | null;

export const getSelectedView = () => selectedView;
export const setSelectedView = (view: BrowserView) => {
  selectedView = view;
};

export const getMainWindow = () => mainWindow;

export const createBrowserView = (): BrowserView => {
  const extensions = getExtensionsObject();
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

  mainWindow?.addBrowserView(view);
  view.setBounds({ x: 0, y: 30, width, height: height - 30 });
  view.setAutoResize({ width: true, height: true });
  view.webContents.loadURL(resolveHtmlPath('index.html'));

  if (!app.isPackaged) view.webContents.toggleDevTools();
  if (mainWindow) extensions.addTab(view.webContents, mainWindow);
  view.webContents.focus();
  return view;
};

export const createWindow = async (): Promise<void> => {
  if (!app.isPackaged) {
    await installDevtoolsExtensions();
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

  mainWindow.setMenu(null);

  await mainWindow.loadURL(resolveHtmlPath('titleBar.html'));

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

  mainWindow.webContents.executeJavaScript(
    `localStorage.setItem("machineId", "${machineId}"); localStorage.setItem("appIsPackaged", "${app.isPackaged}");`,
    true
  );

  event('open_app');
};
