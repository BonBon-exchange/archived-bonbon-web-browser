export interface BrowserTopBarProps {
  closeBrowser: () => void;
  toggleFullsizeBrowser: () => void;
  onClick: () => void;
  title?: string;
  favicon?: string;
}
