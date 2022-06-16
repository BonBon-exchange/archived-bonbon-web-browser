import { useEffect } from 'react';

import { useStoreHelpers } from 'renderer/hooks/useStoreHelpers';

/* eslint-disable import/prefer-default-export */
export const useGlobalEvents = () => {
  const { browser } = useStoreHelpers();

  useEffect(() => {
    window.bonb.listener.newWindow((_e, args: { url: string }) =>
      browser.add(args)
    );
  }, [browser]);

  useEffect(() => {
    window.addEventListener(
      'keydown',
      (e) => {
        if (e.ctrlKey && e.key === 't') {
          browser.add({});
        }
      },
      false
    );
  }, [browser]);

  useEffect(() => {
    window.addEventListener('scroll', (e) => {
      const containerHeight =
        document.querySelector('.Board__container')?.clientHeight;
      const heightDistance =
        document.documentElement.getBoundingClientRect().bottom * -1 +
        window.innerHeight -
        30;
      if (Number(containerHeight) - heightDistance < 100) {
        document.querySelector('.Board__container').style.height = `${
          Number(containerHeight) + 100
        }px`;
      }
    });
  }, []);
};
