/* eslint-disable import/prefer-default-export */
import { useRef, useEffect } from 'react';

import { ContextMenuProps } from './Types';

import './style.css';

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y }) => {
  const container = useRef(null);

  useEffect(() => {
    console.log(x, y);
    container.current.style.top = `${y}px`;
    container.current.style.left = `${x}px`;
  }, [x, y]);

  return (
    <div id="ContextMenu__container" ref={container}>
      <ul>
        <li>First item</li>
      </ul>
    </div>
  );
};
