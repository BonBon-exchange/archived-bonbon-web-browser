/* eslint-disable import/prefer-default-export */
import { ipcMain } from 'electron';
import { event } from './analytics';

export const makeEvents = () => {
  ipcMain.on('inspectElement', (e, args) => {
    e.sender.inspectElement(args.x, args.y);
  });

  ipcMain.on('analytics', (_event, args) => {
    event(args.eventName, args.params);
  });
};
