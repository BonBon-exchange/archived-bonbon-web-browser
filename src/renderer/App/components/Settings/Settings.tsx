/* eslint-disable promise/always-return */
/* eslint-disable import/prefer-default-export */
import { useEffect, useState } from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import { userDb } from 'renderer/App/db/userDb';

import './style.scss';

export const Settings: React.FC = () => {
  const [adBlocker, setAdBlocker] = useState<boolean>(false);

  const changeSettingValue = (key: string, value: unknown) => {
    switch (key) {
      default:
        break;

      case 'adBlocker':
        setAdBlocker(value as boolean);
        userDb.settings
          .put({ key: 'adBlocker', val: Boolean(value) })
          .catch(() =>
            userDb.settings.add({ key: 'adBlocker', val: Boolean(value) })
          );
        break;
    }
  };

  useEffect(() => {
    userDb.settings
      .get({ key: 'adBlocker' })
      .then((value?: { key: string; val: unknown }) => {
        if (value) setAdBlocker(Boolean(value.val));
      })
      .catch(console.log);
  }, []);

  return (
    <div id="Settings__container">
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              defaultChecked={adBlocker}
              checked={adBlocker}
              onChange={(e) =>
                changeSettingValue('adBlocker', e.target.checked)
              }
            />
          }
          label="AdBlocker"
        />
      </FormGroup>
    </div>
  );
};
