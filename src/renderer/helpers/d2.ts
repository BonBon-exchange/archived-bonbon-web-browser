/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable import/prefer-default-export */
export const overlaps = (x, y, height, width, b) => {
  const rect2 = b.getBoundingClientRect();
  rect2.y += window.scrollY;
  const isInHoriztonalBounds = x < rect2.x + rect2.width && x + width > rect2.x;
  const isInVerticalBounds = y < rect2.y + rect2.height && y + height > rect2.y;
  const isOverlapping = isInHoriztonalBounds && isInVerticalBounds;
  return isOverlapping;
};

export const bringBrowserToTheFront = (document: Document, browser) => {
  const browsers = document.querySelectorAll('.Browser__draggable-container');

  browsers.forEach((w) => {
    if (w) w.style.zIndex = '1';
  });

  if (browser) browser.style.zIndex = '2';
};

export const getCoordinateWithNoCollision = (
  document,
  height,
  width
): { x: number; y: number } => {
  const x = 120;
  let y = 0;

  const browsers = document.querySelectorAll('.Browser__draggable-container');
  let collide = true;
  while (collide === true) {
    y += 100;
    let loopCollide = false;
    browsers.forEach((b) => {
      if (overlaps(x, y, height, width, b)) loopCollide = true;
    });
    collide = loopCollide;
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
