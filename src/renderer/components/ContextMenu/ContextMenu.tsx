/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
/* eslint-disable import/prefer-default-export */
import { useRef, useEffect, useState, useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  setIsRenamingBoard,
  removeBoard,
  removeBrowser,
  removeAllBrowsers,
} from '../../store/reducers/Addaps';
import { userDb } from '../../db/userDb';

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
  target,
}) => {
  const container = useRef(null);
  const dispatch = useAppDispatch();
  const { boards } = useAppSelector((state) => state.addaps);
  const [menuItems, setMenuItems] = useState<Record<string, () => void>>({});

  const renameBoard = useCallback(
    (renameTarget: EventTarget | null) => {
      const boardId = renameTarget?.getAttribute('data-boardid');
      dispatch(setIsRenamingBoard(boardId));
    },
    [dispatch]
  );

  const closeBoard = useCallback(
    (renameTarget: EventTarget | null) => {
      const boardId = renameTarget?.getAttribute('data-boardid');
      dispatch(removeBoard({ boardId }));
    },
    [dispatch]
  );

  const saveBoard = useCallback(
    (renameTarget: EventTarget | null) => {
      const boardId = renameTarget?.getAttribute('data-boardid');
      const board = boards.find((b) => b.id === boardId);
      if (board) {
        userDb.boards.put({ id: board.id, label: board.label });
        board.browsers.forEach((browser) => {
          userDb.browsers.put({ boardId: board.id, ...browser });
        });
      }
    },
    [boards]
  );

  const closeBrowser = useCallback(
    (renameTarget: EventTarget | null) => {
      const browserId = renameTarget?.getAttribute('data-browserid');
      dispatch(removeBrowser({ browserId }));
    },
    [dispatch]
  );

  const closeAllBrowsers = useCallback(() => {
    dispatch(removeAllBrowsers());
  }, [dispatch]);

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
      case 'TopBar__tab bold':
        setMenuItems({
          'Inspect element': () => inspectElement(x, y),
          Rename: () => renameBoard(target),
          Save: () => saveBoard(target),
          Close: () => closeBoard(target),
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
  }, [
    targetClass,
    targetId,
    x,
    y,
    target,
    renameBoard,
    closeBoard,
    closeBrowser,
    closeAllBrowsers,
  ]);

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
