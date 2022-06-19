/* eslint-disable @typescript-eslint/no-loop-func */

import { BoardType } from 'renderer/App/components/Board/Types';

/* eslint-disable import/prefer-default-export */
export const overlaps = (
  x: number,
  y: number,
  height: number,
  width: number,
  rect2: { x: number; y: number; width: number; height: number }
) => {
  const isInHoriztonalBounds = x < rect2.x + rect2.width && x + width > rect2.x;
  const isInVerticalBounds = y < rect2.y + rect2.height && y + height > rect2.y;
  const isOverlapping = isInHoriztonalBounds && isInVerticalBounds;
  return isOverlapping;
};

export const bringBrowserToTheFront = (
  document: Document,
  browser: HTMLElement | null
) => {
  const browsers = document.querySelectorAll('.Browser__draggable-container');

  browsers.forEach((w: Element) => {
    const z = w as HTMLElement;
    if (z) z.style.zIndex = '1';
  });

  if (browser) browser.style.zIndex = '2';
};

export const getCoordinateWithNoCollision = (
  document: Document,
  board: BoardType,
  height: number,
  width: number
): { x: number; y: number } => {
  let x = 0;
  let y = 0;
  const step = 90;
  const maxX =
    (document.querySelector('.Board__container')?.clientWidth || 0) -
    width -
    step;

  let collide = true;
  while (collide) {
    y += step;
    while (collide && x < maxX) {
      x += step;
      collide = !board.browsers.every(
        (b) =>
          overlaps(x, y, height, width, {
            x: b.left,
            y: b.top,
            width: b.width,
            height: b.height,
          }) === false
      );
    }
    if (collide) x = 0;
  }

  return { x, y };
};

export const scrollToBrowser = (
  document: Document,
  browserId: string
): void => {
  document.querySelector(`#Browser__${browserId}`)?.scrollIntoView();
  window.scrollBy(0, -100);

  bringBrowserToTheFront(
    document,
    document.querySelector(`#Browser__${browserId}`)
  );
};
