export interface ContextMenuProps {
  x: number;
  y: number;
  targetId?: string;
  targetClass?: string;
  target: EventTarget | null;
}
