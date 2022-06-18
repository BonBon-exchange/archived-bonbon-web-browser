import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

contextBridge.exposeInMainWorld('bonb', {
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
    openBoard: (action: (event: IpcRendererEvent, ...args: any[]) => void) => {
      ipcRenderer.on('open-board', action);
    },
    showLibrary: (
      action: (event: IpcRendererEvent, ...args: any[]) => void
    ) => {
      ipcRenderer.on('show-library', action);
    },
  },
  off: {
    newWindow: () => {
      ipcRenderer.removeAllListeners('new-window');
    },
    loadBoard: () => {
      ipcRenderer.removeAllListeners('load-board');
    },
    openBoard: () => {
      ipcRenderer.removeAllListeners('open-board');
    },
    showLibrary: () => {
      ipcRenderer.removeAllListeners('show-library');
    },
  },
});

contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system'),
});
