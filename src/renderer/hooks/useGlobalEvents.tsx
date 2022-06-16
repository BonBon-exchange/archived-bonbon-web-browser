/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/prefer-default-export */
import { useCallback, useEffect } from 'react';

import { useStoreHelpers } from 'renderer/hooks/useStoreHelpers';

export const useGlobalEvents = () => {
  const { browser } = useStoreHelpers();

  const keyDownListener = useCallback(
    (e: { ctrlKey: boolean; key: string }) => {
      if (e.ctrlKey && e.key === 't') {
        browser.add({});
      }
    },
    [browser]
  );

  const scrollListener = () => {
    const containerHeight =
      document.querySelector('.Board__container')?.clientHeight;
    const heightDistance =
      document.documentElement.getBoundingClientRect().bottom * -1 +
      window.innerHeight -
      30;
    if (Number(containerHeight) - heightDistance < 100) {
      // @ts-ignore
      document.querySelector('.Board__container').style.height = `${
        Number(containerHeight) + 100
      }px`;
    }
  };

  const newWindowAction = useCallback(
    (_e: any, args: { url: string }) => browser.add(args),
    [browser]
  );

  useEffect(() => {
    window.bonb.listener.newWindow(newWindowAction);
  });

  useEffect(() => {
    window.addEventListener('keydown', keyDownListener, false);
    return () => window.removeEventListener('keydown', keyDownListener);
  }, [keyDownListener]);

  useEffect(() => {
    window.addEventListener('scroll', scrollListener);
    return () => window.removeEventListener('scroll', scrollListener);
  }, []);
};
