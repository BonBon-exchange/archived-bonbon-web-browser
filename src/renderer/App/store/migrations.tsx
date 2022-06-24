import { PersistedState } from 'redux-persist';

/* eslint-disable import/prefer-default-export */
export const migrations = {
  2: (state: PersistedState) => ({ board: { ...state.board, closdUrls: [] } }),
};
