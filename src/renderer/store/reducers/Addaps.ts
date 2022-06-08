import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 } from 'uuid';
import { BoardType } from '../../components/Board/Types';

type UpdateBrowserUrlType = {
  url: string;
  browserId: string;
  boardId: string;
};

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
    updateBrowserUrl: (state, action: PayloadAction<UpdateBrowserUrlType>) => {
      const boards = [...state.boards];
      const boardIndex = boards.findIndex(
        (b) => b.id === action.payload.boardId
      );
      if (boardIndex > -1) {
        const browserIndex = boards[boardIndex].browsers.findIndex(
          (b) => b.id === action.payload.browserId
        );
        const browser = boards[boardIndex].browsers[browserIndex];
        browser.url = action.payload.url;
        boards[boardIndex].browsers[browserIndex] = browser;
        state.boards = boards;
      }
    },
  },
});

export const { setBoards, setActiveBoard, updateBrowserUrl } =
  addapsSlice.actions;

export default addapsSlice.reducer;
