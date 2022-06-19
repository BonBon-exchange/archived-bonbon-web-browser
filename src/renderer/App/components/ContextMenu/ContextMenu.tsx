/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
/* eslint-disable import/prefer-default-export */
import { useRef, useEffect, useState, useCallback } from 'react';

import { useAppDispatch } from 'renderer/App/store/hooks';
import {
  removeBrowser,
  removeAllBrowsers,
} from 'renderer/App/store/reducers/Board';

import { ContextMenuProps } from './Types';

import './style.css';

const inspectElement = (x: number, y: number) => {
  window.app.tools.inspectElement({ x, y });
};

export const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  targetClass,
  targetId,
  target,
}) => {
  const container = useRef(null);
  const dispatch = useAppDispatch();
  const [menuItems, setMenuItems] = useState<Record<string, () => void>>({});

  const closeBrowser = useCallback(
    (renameTarget: EventTarget | null) => {
      const htmlTarget = renameTarget as HTMLElement;
      const browserId = htmlTarget?.getAttribute('data-browserid');
      if (browserId) dispatch(removeBrowser(browserId));
    },
    [dispatch]
  );

  const closeAllBrowsers = useCallback(() => {
    dispatch(removeAllBrowsers());
  }, [dispatch]);

  useEffect(() => {
    if (container.current) {
      const containerHtml = container.current as HTMLElement;
      containerHtml.style.top = `${y}px`;
      containerHtml.style.left = `${x}px`;
    }
  }, [x, y]);

  useEffect(() => {
    switch (targetClass) {
      default:
        setMenuItems({
          'Inspect element': () => inspectElement(x, y),
        });
        break;

      case 'LeftBar__browserFavImg':
        setMenuItems({
          'Inspect element': () => inspectElement(x, y),
          Close: () => closeBrowser(target),
          'Close all': () => closeAllBrowsers(),
        });
        break;
    }
  }, [targetClass, targetId, x, y, target, closeBrowser, closeAllBrowsers]);

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
