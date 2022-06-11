export interface BrowserControlBarProps {
  goBack: () => void;
  goForward: () => void;
  reload: () => void;
  goHome: () => void;
  url: string;
  browserId: string;
}
