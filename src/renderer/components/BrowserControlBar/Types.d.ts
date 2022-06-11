export interface BrowserControlBarProps {
  goBack: () => void;
  goForward: () => void;
  reload: () => void;
  url: string;
  browserId: string;
}
