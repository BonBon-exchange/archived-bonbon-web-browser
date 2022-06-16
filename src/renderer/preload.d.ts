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
        off: {
          newWindow: (action: unknown) => void;
        };
      };
    };
  }
}

export {};
