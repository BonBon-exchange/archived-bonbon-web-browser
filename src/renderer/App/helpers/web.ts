/* eslint-disable import/prefer-default-export */
export const isValidHttpUrl = (s: string) => {
  let url;

  try {
    url = new URL(s);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
};

export const makeSearchUrl = (search: string) =>
  `https://www.google.com/search?q=${search}`;
