declare global {
  interface Window {
    app: {
      analytics: {
        event: (eventName: string, params?: Record<string, string>) => void;
      };
      tools: {
        inspectElement: (point: { x: number; y: number }) => void;
      };
      board: {
        open: (board: {
          id: string;
          label: string;
          isFullSize: boolean;
        }) => void;
      };
      browser: {
        select: (webContentsId: string) => void;
      };
      listener: {
        newWindow: (action: unknown) => void;
        loadBoard: (action: unknown) => void;
        purge: (action: unknown) => void;
        showLibrary: (action: unknown) => void;
        showSettings: (action: unknown) => void;
        saveBoard: (action: unknown) => void;
        renameBoard: (action: unknown) => void;
        closeWebview: (action: unknown) => void;
        closeAllWebview: (action: unknown) => void;
      };
      off: {
        newWindow: () => void;
        loadBoard: () => void;
        showLibrary: () => void;
        showSettings: () => void;
        purge: () => void;
        saveBoard: () => void;
        renameBoard: () => void;
        closeWebview: () => void;
        closeAllWebview: () => void;
      };
    };
    darkMode: {
      toggle: () => void;
      system: () => void;
    };
  }
}

export {};
