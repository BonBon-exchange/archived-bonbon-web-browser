declare global {
  interface Window {
    bonb: {
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
      listener: {
        newWindow: (action: unknown) => void;
        loadBoard: (action: unknown) => void;
        openBoard: (action: unknown) => void;
        showLibrary: (action: unknown) => void;
        openTab: (action: unknown) => void;
      };
      off: {
        newWindow: () => void;
        loadBoard: () => void;
        openBoard: () => void;
        showLibrary: () => void;
        openTab: () => void;
      };
      tabs: {
        select: (tabId: string) => void;
        openBoard: (boardId: string) => void;
      };
      screens: {
        library: () => void;
      };
    };
  }
}

export {};
