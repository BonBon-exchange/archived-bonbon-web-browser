export interface BrowserProps {
  id: string;
  url: string;
  top: number;
  left: number;
  height: number;
  width: number;
  firstRendering?: boolean;
  favicon?: string;
  title?: string;
}
