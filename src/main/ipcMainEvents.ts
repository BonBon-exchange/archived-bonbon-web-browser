/* eslint-disable import/prefer-default-export */
import { ipcMain, BrowserWindow } from 'electron';
import { event } from './analytics';

export const makeEvents = (mainWindow: BrowserWindow) => {
  ipcMain.on('inspectElement', (_event, args) => {
    mainWindow?.webContents.inspectElement(args.x, args.y);
  });

  ipcMain.on('analytics', (_event, args) => {
    event(args.eventName, args.params);
  });
};
