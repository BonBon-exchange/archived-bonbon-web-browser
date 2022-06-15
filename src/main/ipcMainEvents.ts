/* eslint-disable import/prefer-default-export */
import { ipcMain, BrowserWindow } from 'electron';
import { event } from './analytics';

export const makeEvents = (mainWindow: BrowserWindow) => {
  ipcMain.on('inspectElement', async (_event, args) => {
    mainWindow?.webContents.inspectElement(args.x, args.y);
  });

  ipcMain.on('analytics', async (_event, args) => {
    event(args.eventName, args.params);
  });
};
