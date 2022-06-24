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
  closedUrls: [],
  isFullSize: false,
};

const initialState: BoardState = {
  board: newBoard,
};

const addCLosedUrl = (state, url: string) => {
  if (state.board.closedUrls.length > 20) {
    state.baord.closedUrls.splice(0, 1);
  }
  state.board.closedUrls.push(url);
};

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setBoard: (state, action: PayloadAction<BoardType>) => {
      state.board = action.payload;
      const finded = state.board.browsers.find(
        (b) => b.id === state.board.activeBrowser
      );
      if (!state.board.activeBrowser || !finded) {
        if (state.board.browsers.length > 0) {
          state.board.activeBrowser =
            state.board.browsers[state.board.browsers.length - 1].id;
        }
      }
      const wcId = state.board.browsers.find(
        (b) => b.id === state.board.activeBrowser
      )?.webContentsId;
      if (wcId) window.app.browser.select(wcId);
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
      state.board.activeBrowser = action.payload.id;
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
      // remove browser from state
      if (browserIndex > -1) {
        if (!state.board.closedUrls) state.board.closedUrls = [];
        addCLosedUrl(state, state.board.browsers[browserIndex].url);
        state.board.browsers.splice(browserIndex, 1);
      }

      // clean activeBrowser
      if (state.board.browsers.length > 0) {
        state.board.activeBrowser =
          state.board.browsers[state.board.browsers.length - 1].id;
        const wcId = state.board.browsers.find(
          (b) => b.id === state.board.activeBrowser
        )?.webContentsId;
        if (wcId) window.app.browser.select(wcId);
      } else {
        state.board.activeBrowser = null;
        window.app.browser.selectBrowserView();
      }

      // send event
      window.app.analytics.event('close_browser');
    },
    removeAllBrowsers: (state) => {
      if (!state.board.closedUrls) state.board.closedUrls = [];
      state.board.browsers.forEach((b) => addCLosedUrl(state, b.url));
      state.board.browsers = [];
      window.app.analytics.event('close_all_browser');
    },
    removeLastCloseUrl: (state) => {
      state.board.closedUrls.splice(state.board.closedUrls.length - 1, 1);
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
  removeLastCloseUrl,
} = boardSlice.actions;

export default boardSlice.reducer;
