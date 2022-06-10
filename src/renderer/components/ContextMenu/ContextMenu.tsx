/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
/* eslint-disable import/prefer-default-export */
import { useRef, useEffect, useState } from 'react';

import { ContextMenuProps } from './Types';

import './style.css';

const inspectElement = (x: number, y: number) => {
  window.electron.ipcRenderer.sendMessage('inspectElement', { x, y });
};

export const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  targetClass,
  targetId,
}) => {
  const container = useRef(null);

  const [menuItems, setMenuItems] = useState<Record<string, () => void>>({});

  useEffect(() => {
    container.current.style.top = `${y}px`;
    container.current.style.left = `${x}px`;
  }, [x, y]);

  useEffect(() => {
    switch (targetClass) {
      default:
        setMenuItems({
          'Inspect element': () => inspectElement(x, y),
        });
        break;

      case 'TopBar__tab':
        setMenuItems({
          'Inspect element': () => inspectElement(x, y),
          Rename: () => null,
        });
        break;
    }
  }, [targetClass, targetId, x, y]);

  return (
    <div id="ContextMenu__container" ref={container}>
      <ul>
        {Object.keys(menuItems).map((k, i) => {
          return (
            <li key={i} onClick={menuItems[k]}>
              {k}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
