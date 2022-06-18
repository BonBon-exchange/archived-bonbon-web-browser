/* eslint-disable import/prefer-default-export */
import { useState, useRef, useCallback, useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { Addaps } from 'renderer/App/components/Addaps';
import { store, getPersistedStoreAndPersistor } from 'renderer/App/store/store';

import './App.css';

export function App() {
  const [isLoadedBoard, setIsLoadedBoard] = useState<boolean | string>(false);
  const [boardId, setBoardId] = useState<string>('');
  const persisted = useRef<any>(null);

  const loadBoardAction = useCallback((_e: any, args: { boardId: string }) => {
    persisted.current = getPersistedStoreAndPersistor(args.boardId);
    setBoardId(args.boardId);
    setIsLoadedBoard(true);
  }, []);

  useEffect(() => {
    window.bonb.listener.loadBoard(loadBoardAction);
    return () => window.bonb.off.loadBoard();
  }, [loadBoardAction]);

  useEffect(() => {
    window.bonb.analytics.event('load_app');
  }, []);

  return isLoadedBoard ? (
    <Provider store={persisted.current?.store}>
      <PersistGate loading={null} persistor={persisted.current?.persistor}>
        <Addaps boardId={boardId} />
      </PersistGate>
    </Provider>
  ) : (
    <Provider store={store}>
      <Addaps />
    </Provider>
  );
}
