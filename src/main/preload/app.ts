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
  listener: {
    newWindow: (action: (event: IpcRendererEvent, ...args: any[]) => void) => {
      ipcRenderer.on('new-window', action);
    },
    loadBoard: (action: (event: IpcRendererEvent, ...args: any[]) => void) => {
      ipcRenderer.on('load-board', action);
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
    showLibrary: () => {
      ipcRenderer.removeAllListeners('show-library');
    },
  },
});

contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system'),
});
