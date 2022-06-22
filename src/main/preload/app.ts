import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

contextBridge.exposeInMainWorld('app', {
  analytics: {
    event: (eventName: string, params: Record<string, string>) => {
      ipcRenderer.send('analytics', { eventName, params });
    },
  },
  tools: {
    inspectElement: (point: { x: number; y: number }) => {
      ipcRenderer.send('inspectElement', point);
    },
  },
  board: {
    open: (board: { id: string; label: string; isFullSize: boolean }) => {
      ipcRenderer.send('open-board', board);
    },
  },
  browser: {
    select: (webContentsId: string) => {
      ipcRenderer.send('select-browser', webContentsId);
    },
    selectBrowserView: () => {
      ipcRenderer.send('select-browserView');
    },
  },
  listener: {
    newWindow: (action: (event: IpcRendererEvent, ...args: any[]) => void) => {
      ipcRenderer.on('new-window', action);
    },
    loadBoard: (action: (event: IpcRendererEvent, ...args: any[]) => void) => {
      ipcRenderer.on('load-board', action);
    },
    purge: (action: (event: IpcRendererEvent, ...args: any[]) => void) => {
      ipcRenderer.on('purge', action);
    },
    showLibrary: (
      action: (event: IpcRendererEvent, ...args: any[]) => void
    ) => {
      ipcRenderer.on('show-library', action);
    },
    showSettings: (
      action: (event: IpcRendererEvent, ...args: any[]) => void
    ) => {
      ipcRenderer.on('show-settings', action);
    },
    saveBoard: (action: (event: IpcRendererEvent, ...args: any[]) => void) => {
      ipcRenderer.on('save-board', action);
    },
    renameBoard: (
      action: (event: IpcRendererEvent, ...args: any[]) => void
    ) => {
      ipcRenderer.on('rename-board', action);
    },
    closeWebview: (
      action: (event: IpcRendererEvent, ...args: any[]) => void
    ) => {
      ipcRenderer.on('close-webview', action);
    },
    closeAllWebview: (
      action: (event: IpcRendererEvent, ...args: any[]) => void
    ) => {
      ipcRenderer.on('close-all-webview', action);
    },
  },
  off: {
    newWindow: () => {
      ipcRenderer.removeAllListeners('new-window');
    },
    loadBoard: () => {
      ipcRenderer.removeAllListeners('load-board');
    },
    showLibrary: () => {
      ipcRenderer.removeAllListeners('show-library');
    },
    showSettings: () => {
      ipcRenderer.removeAllListeners('show-settings');
    },
    purge: () => {
      ipcRenderer.removeAllListeners('purge');
    },
    saveBoard: () => {
      ipcRenderer.removeAllListeners('save-board');
    },
    renameBoard: () => {
      ipcRenderer.removeAllListeners('rename-board');
    },
    closeWebview: () => {
      ipcRenderer.removeAllListeners('close-webview');
    },
    closeAllWebview: () => {
      ipcRenderer.removeAllListeners('close-all-webview');
    },
  },
});
