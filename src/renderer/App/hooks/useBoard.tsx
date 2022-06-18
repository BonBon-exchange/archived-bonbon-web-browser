/* eslint-disable import/prefer-default-export */
import { useAppSelector } from 'renderer/App/store/hooks';

export const useBoard = () => {
  const { boards, activeBoard } = useAppSelector((state) => state.addaps);
  const board = boards.find((b) => b.id === activeBoard);

  return board;
};
