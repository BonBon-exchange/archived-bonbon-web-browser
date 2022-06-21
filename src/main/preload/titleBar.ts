import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { injectBrowserAction } from 'electron-chrome-extensions/dist/browser-action';

injectBrowserAction();

contextBridge.exposeInMainWorld('titleBar', {
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
    save: (tabId: string) => {
      ipcRenderer.send('save-tab', { tabId });
    },
    rename: ({ tabId, label }: { tabId: string; label: string }) => {
      ipcRenderer.send('rename-tab', { tabId, label });
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
    saveBoard: (action: (event: IpcRendererEvent, ...args: any[]) => void) => {
      ipcRenderer.on('save-board', action);
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
    saveBoard: () => {
      ipcRenderer.removeAllListeners('save-board');
    },
  },
  screens: {
    library: () => {
      ipcRenderer.send('show-library');
    },
    settings: () => {
      ipcRenderer.send('show-settings');
    },
  },
});

contextBridge.exposeInMainWorld('darkMode', {
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system'),
});
