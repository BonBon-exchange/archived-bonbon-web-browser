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
  document: Document,
  height: number,
  width: number
): { x: number; y: number } => {
  let x = 0;
  let y = 0;
  const maxX = document.querySelector('.Board__container').clientWidth - width;

  const browsers = document.querySelectorAll('.Browser__draggable-container');
  let collide = true;
  while (collide) {
    y += 100;
    while (collide && x < maxX) {
      x += 100;
      let loopCollide = false;
      browsers.forEach((b) => {
        if (overlaps(x, y, height, width, b)) loopCollide = true;
      });
      collide = loopCollide;
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
