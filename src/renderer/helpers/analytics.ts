/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import { machineIdSync } from 'node-machine-id';
import { app } from 'electron';

const makePayload = (eventName: string, params?: Record<string, unknown>) => {
  return {
    client_id: machineIdSync(),
    events: [
      {
        name: eventName,
        params: {
          app_is_packaged: app.isPackaged ? 'true' : 'false',
          engagement_time_msec: 1,
          app_name: 'Bonb',
          ...params,
        },
      },
    ],
  };
};

export const event = (eventName: string, params?: Record<string, unknown>) => {
  const payload = makePayload(eventName, params);
  axios
    .post(
      'https://google-analytics.com/mp/collect?api_secret=wvmixxOmSEm5svFi35Qo4g&measurement_id=G-PDRJCJWQYM',
      payload
    )
    .catch(console.log);
};
