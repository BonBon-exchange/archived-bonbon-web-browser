/* eslint-disable import/prefer-default-export */
import Nucleus from 'nucleus-nodejs';

export const event = (
  eventName: string,
  params?: { [key: string]: string | number | boolean } | undefined
) => {
  Nucleus.track(eventName, params);
};
