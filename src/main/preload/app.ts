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
    saveBoard: (action: (event: IpcRendererEvent, ...args: any[]) => void) => {
      ipcRenderer.on('save-board', action);
    },
    renameBoard: (
      action: (event: IpcRendererEvent, ...args: any[]) => void
    ) => {
      ipcRenderer.on('rename-board', action);
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
    purge: () => {
      ipcRenderer.removeAllListeners('purge');
    },
    saveBoard: () => {
      ipcRenderer.removeAllListeners('save-board');
    },
    renameBoard: () => {
      ipcRenderer.removeAllListeners('rename-board');
    },
  },
});

contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system'),
});
