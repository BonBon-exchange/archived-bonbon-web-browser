/* eslint-disable import/prefer-default-export */
import { useAppSelector } from 'renderer/App/store/hooks';
import { BoardType } from 'renderer/App/components/Board/Types';

export const useBoard = () => {
  const { board }: { board: BoardType } = useAppSelector(
    (state) => state.board
  );

  return board;
};
