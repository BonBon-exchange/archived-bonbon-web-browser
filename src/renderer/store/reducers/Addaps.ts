import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 } from 'uuid';
import { BoardType } from '../../components/Board/Types';

interface AddapsState {
  boards: BoardType[];
  activeBoard: string;
}

const id = v4();
const newBoard = {
  id,
  label: 'New board',
  browsers: [],
};

const initialState: AddapsState = {
  boards: [newBoard],
  activeBoard: id,
};

export const addapsSlice = createSlice({
  name: 'addaps',
  initialState,
  reducers: {
    setBoards: (state, action: PayloadAction<BoardType[]>) => {
      state.boards = action.payload;
    },
    setActiveBoard: (state, action: PayloadAction<string>) => {
      state.activeBoard = action.payload;
    },
  },
});

export const { setBoards, setActiveBoard } = addapsSlice.actions;

export default addapsSlice.reducer;
