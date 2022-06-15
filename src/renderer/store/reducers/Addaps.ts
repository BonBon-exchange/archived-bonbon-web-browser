import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 } from 'uuid';

import { BrowserProps } from 'renderer/components/Browser/Types';
import { BoardType } from '../../components/Board/Types';

type UpdateBrowserUrlType = {
  url: string;
  browserId: string;
  boardId: string;
};

type UpdateBrowserFavType = {
  favicon: string;
  browserId: string;
  boardId: string;
};

type RenameBoardType = {
  boardId: string;
  label: string;
};

type RemoveBoardType = {
  boardId: string;
};

type RemoveBrowserType = {
  browserId: string;
};

interface AddapsState {
  boards: BoardType[];
  activeBoard: string;
  isRenamingBoard: string | null;
}

const browserId = v4();
const newBrowser = {
  id: browserId,
  url: 'https://www.google.com',
  top: 120,
  left: 120,
  height: 800,
  width: 600,
  isFullSize: false,
  firstRendering: true,
  favicon: '',
};

const boardId = v4();
const newBoard = {
  id: boardId,
  label: 'Board 1',
  browsers: [newBrowser],
};

const initialState: AddapsState = {
  boards: [newBoard],
  activeBoard: boardId,
  isRenamingBoard: null,
};

export const addapsSlice = createSlice({
  name: 'addaps',
  initialState,
  reducers: {
    setBoards: (state, action: PayloadAction<BoardType[]>) => {
      state.boards = action.payload;
    },
    addBoard: (state, action: PayloadAction<BoardType>) => {
      state.boards.push(action.payload);
    },
    setActiveBoard: (state, action: PayloadAction<string>) => {
      state.activeBoard = action.payload;
    },
    setIsRenamingBoard: (state, action: PayloadAction<string | null>) => {
      state.isRenamingBoard = action.payload;
    },
    addBrowser: (state, action: PayloadAction<BrowserProps>) => {
      const boards = [...state.boards];
      const boardIndex = boards.findIndex((b) => b.id === state.activeBoard);

      if (boardIndex > -1) {
        boards[boardIndex].browsers.push(action.payload);
        state.boards = boards;
      }
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
    updateBrowserFav: (state, action: PayloadAction<UpdateBrowserFavType>) => {
      const boards = [...state.boards];
      const boardIndex = boards.findIndex(
        (b) => b.id === action.payload.boardId
      );
      if (boardIndex > -1) {
        const browserIndex = boards[boardIndex].browsers.findIndex(
          (b) => b.id === action.payload.browserId
        );
        const browser = boards[boardIndex].browsers[browserIndex];
        browser.favicon = action.payload.favicon;
        boards[boardIndex].browsers[browserIndex] = browser;
        state.boards = boards;
      }
    },
    renameBoard: (state, action: PayloadAction<RenameBoardType>) => {
      const boards = [...state.boards];
      const boardIndex = boards.findIndex(
        (b) => b.id === action.payload.boardId
      );
      if (boardIndex > -1) {
        boards[boardIndex].label = action.payload.label;
        state.boards = boards;
      }
    },
    removeBoard: (state, action: PayloadAction<RemoveBoardType>) => {
      const boards = [...state.boards];
      const boardIndex = boards.findIndex(
        (b) => b.id === action.payload.boardId
      );
      if (boardIndex > -1) {
        boards.splice(boardIndex, 1);
        state.boards = boards;
      }
    },
    removeBrowser: (state, action: PayloadAction<RemoveBrowserType>) => {
      const boards = [...state.boards];
      const boardIndex = boards.findIndex((b) => b.id === state.activeBoard);
      if (boardIndex > -1) {
        const browserIndex = boards[boardIndex].browsers.findIndex(
          (b) => b.id === action.payload.browserId
        );
        boards[boardIndex].browsers.splice(browserIndex, 1);
        state.boards = boards;
      }
    },
    removeAllBrowsers: (state, _action: PayloadAction) => {
      const boards = [...state.boards];
      const boardIndex = boards.findIndex((b) => b.id === state.activeBoard);
      if (boardIndex > -1) {
        boards[boardIndex].browsers = [];
        state.boards = boards;
      }
    },
  },
});

export const {
  setBoards,
  setActiveBoard,
  updateBrowserUrl,
  updateBrowserFav,
  setIsRenamingBoard,
  renameBoard,
  removeBoard,
  removeBrowser,
  removeAllBrowsers,
  addBoard,
  addBrowser,
} = addapsSlice.actions;

export default addapsSlice.reducer;
