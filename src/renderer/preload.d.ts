declare global {
  interface Window {
    bonb: {
      analytics: {
        event: (eventName: string, params?: Record<string, string>) => void;
      };
      tools: {
        inspectElement: (point: { x: number; y: number }) => void;
      };
      listener: {
        newWindow: (action: unknown) => void;
        loadBoard: (action: unknown) => void;
        showLibrary: (action: unknown) => void;
      };
      off: {
        newWindow: () => void;
        loadBoard: () => void;
        showLibrary: () => void;
      };
      tabs: {
        select: (tabId: string) => void;
      };
      screens: {
        library: () => void;
      };
    };
  }
}

export {};
