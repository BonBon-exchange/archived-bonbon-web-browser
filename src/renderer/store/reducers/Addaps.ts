import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BoardProps } from '../../components/Board/Types';


interface AddapsState {
  boards: BoardProps[];
  activeBoard: string;
}

const initialState: AddapsState = {
  boards: [],
  activeBoard: ''
};

export const addapsSlice = createSlice({
  name: 'addaps',
  initialState,
  reducers: {
    setBoards: (state, action: PayloadAction<BoardProps[]>) => {
      state.boards = action.payload;
    },
    setActiveBoard: (state, action: PayloadAction<string>) => {
      state.activeBoard = action.payload;
    }
  },
});

export const { setBoards, setActiveBoard } = addapsSlice.actions;

export default addapsSlice.reducer;
