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
  tabs: {
    select: (tabId: string) => {
      ipcRenderer.send('tab-select', { tabId });
    },
    purge: (tabId: string) => {
      ipcRenderer.send('tab-purge', { tabId });
    },
  },
  listener: {
    openTab: (action: (event: IpcRendererEvent, ...args: any[]) => void) => {
      ipcRenderer.on('open-tab', action);
    },
    renameTab: (action: (event: IpcRendererEvent, ...args: any[]) => void) => {
      ipcRenderer.on('rename-tab', action);
    },
    closeTab: (action: (event: IpcRendererEvent, ...args: any[]) => void) => {
      ipcRenderer.on('close-tab', action);
    },
  },
  off: {
    openTab: () => {
      ipcRenderer.removeAllListeners('open-tab');
    },
    renameTab: () => {
      ipcRenderer.removeAllListeners('rename-tab');
    },
    closeTab: () => {
      ipcRenderer.removeAllListeners('close-tab');
    },
  },
  screens: {
    library: () => {
      ipcRenderer.send('show-library');
    },
  },
});

contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system'),
});
