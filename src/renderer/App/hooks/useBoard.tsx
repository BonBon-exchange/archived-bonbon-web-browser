/* eslint-disable import/prefer-default-export */
import { useAppSelector } from 'renderer/App/store/hooks';

export const useBoard = () => {
  const { board } = useAppSelector((state) => state.board);

  return board;
};
