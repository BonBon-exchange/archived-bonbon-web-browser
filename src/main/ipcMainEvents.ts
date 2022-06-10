/* eslint-disable import/prefer-default-export */
import { ipcMain } from 'electron';

export const makeEvents = (mainWindow) => {
  ipcMain.on('ipc-example', async (event, arg) => {
    const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
    console.log(msgTemplate(arg));
    event.reply('ipc-example', msgTemplate('pong'));
  });

  ipcMain.on('inspectElement', async (_event, args) => {
    mainWindow?.webContents.inspectElement(args.x, args.y);
  });
};
