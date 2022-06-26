/* eslint-disable global-require */
/* eslint-disable import/prefer-default-export */
import fs from 'fs';
import path from 'path';
import { app, session } from 'electron';
import { ElectronChromeExtensions } from 'electron-chrome-extensions';

import { getMainWindow, getSelectedView } from './browser';

let extensions: ElectronChromeExtensions;

export const getExtensionsObject = () => extensions;

export const installDevtoolsExtensions = async (): Promise<void> => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensionsToInstall = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return installer
    .default(
      extensionsToInstall.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

export const installUserExtensions = () => {
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
        session.fromPartition('persist:user-partition').loadExtension(extPath);
      });
  };

  loadExtensions(forcedExtensionsPath);
  loadExtensions(userExtensionsPath);
};

export const makeChromeExtensionSupport = () => {
  extensions = new ElectronChromeExtensions({
    session: session.fromPartition('persist:user-partition'),
    modulePath: app.isPackaged
      ? path.join(__dirname, '../../../node_modules/electron-chrome-extensions')
      : undefined,
    createTab(details) {
      return new Promise((resolve, reject) => {
        getSelectedView().webContents.send('new-window', { url: details.url });
        const mainWindow = getMainWindow();
        if (mainWindow) resolve([getSelectedView().webContents, mainWindow]);
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
};
