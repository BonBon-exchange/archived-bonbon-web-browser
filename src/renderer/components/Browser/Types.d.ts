export interface BrowserProps {
  id: string;
  url: string;
  top: number;
  left: number;
  height: number;
  width: number;
  isFullSize: boolean;
  firstRendering?: boolean;
  favicon?: string;
}
