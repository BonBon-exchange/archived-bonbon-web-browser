import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 } from 'uuid';

import { BrowserProps } from 'renderer/App/components/Browser/Types';
import { BoardType } from 'renderer/App/components/Board/Types';

type UpdateBrowserType = {
  browserId: string;
  params: Partial<BrowserProps>;
};

type UpdateBrowserUrlType = {
  url: string;
  browserId: string;
};

type UpdateBrowserTitleType = {
  title: string;
  browserId: string;
};

type UpdateBrowserFavType = {
  favicon: string;
  browserId: string;
};

interface BoardState {
  board: BoardType;
}

const browserId = v4();
const newBrowser = {
  id: browserId,
  url: 'https://www.google.com',
  top: 120,
  left: 120,
  height: 800,
  width: 600,
  firstRendering: true,
  favicon: '',
  title: '',
};

const boardId = v4();
const newBoard = {
  id: boardId,
  label: 'New board',
  browsers: [newBrowser],
  activeBrowser: browserId,
  isFullSize: false,
};

const initialState: BoardState = {
  board: newBoard,
};

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setBoard: (state, action: PayloadAction<BoardType>) => {
      state.board = action.payload;
    },
    toggleBoardFullSize: (state) => {
      state.board.isFullSize = !state.board.isFullSize;
      window.app.analytics.event(`toggle_fullsize_${!state.board.isFullSize}`);
    },
    setActiveBrowser: (state, action: PayloadAction<string>) => {
      state.board.activeBrowser = action.payload;
      const wcId = state.board.browsers.find(
        (b) => b.id === action.payload
      )?.webContentsId;
      if (wcId) window.app.browser.select(wcId);
    },
    addBrowser: (state, action: PayloadAction<BrowserProps>) => {
      state.board.browsers.push(action.payload);
      window.app.analytics.event('add_browser');
    },
    updateBrowser: (state, action: PayloadAction<UpdateBrowserType>) => {
      const browserIndex = state.board.browsers.findIndex(
        (b) => b.id === action.payload.browserId
      );
      if (browserIndex > -1) {
        state.board.browsers[browserIndex] = {
          ...state.board.browsers[browserIndex],
          ...action.payload.params,
        };
      }
    },
    updateBrowserUrl: (state, action: PayloadAction<UpdateBrowserUrlType>) => {
      const browserIndex = state.board.browsers.findIndex(
        (b) => b.id === action.payload.browserId
      );
      if (browserIndex > -1) {
        state.board.browsers[browserIndex].url = action.payload.url;
      }
    },
    updateBrowserTitle: (
      state,
      action: PayloadAction<UpdateBrowserTitleType>
    ) => {
      const browserIndex = state.board.browsers.findIndex(
        (b) => b.id === action.payload.browserId
      );
      if (browserIndex > -1) {
        state.board.browsers[browserIndex].title = action.payload.title;
      }
    },
    updateBrowserFav: (state, action: PayloadAction<UpdateBrowserFavType>) => {
      const browserIndex = state.board.browsers.findIndex(
        (b) => b.id === action.payload.browserId
      );
      if (browserIndex > -1) {
        state.board.browsers[browserIndex].favicon = action.payload.favicon;
      }
    },
    renameBoard: (state, action: PayloadAction<string>) => {
      state.board.label = action.payload;
      window.app.analytics.event('rename_board');
    },
    removeBrowser: (state, action: PayloadAction<string>) => {
      const browserIndex = state.board.browsers.findIndex(
        (b) => b.id === action.payload
      );
      if (browserIndex > -1) {
        state.board.browsers.splice(browserIndex, 1);
      }
      window.app.analytics.event('close_browser');
    },
    removeAllBrowsers: (state) => {
      state.board.browsers = [];
      window.app.analytics.event('close_all_browser');
    },
  },
});

export const {
  setBoard,
  updateBrowserUrl,
  updateBrowserFav,
  renameBoard,
  removeBrowser,
  removeAllBrowsers,
  addBrowser,
  setActiveBrowser,
  updateBrowserTitle,
  updateBrowser,
  toggleBoardFullSize,
} = boardSlice.actions;

export default boardSlice.reducer;
