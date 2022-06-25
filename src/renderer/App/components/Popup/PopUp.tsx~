/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable promise/always-return */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable import/prefer-default-export */
import CloseIcon from '@mui/icons-material/Close';

import { PopUpProps } from './Types';

import './style.scss';

export const Popup: React.FC<PopUpProps> = ({
  children,
  closePopup,
  title,
}) => {
  return (
    <div id="Popup__container">
      <div id="Popup__close-icon" onClick={closePopup}>
        <CloseIcon />
      </div>

      <div id="Popup__title">{title}</div>
      {children}
    </div>
  );
};
