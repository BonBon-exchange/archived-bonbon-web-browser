import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type TabProps = {
  id: string;
  label: string;
};

type TabsState = {
  tabs: TabProps[];
  activeTab: string;
  isRenaming: string | null;
};

type RenameTabType = {
  id: string;
  label: string;
};

const initialState: TabsState = {
  tabs: [],
  activeTab: '',
  isRenaming: null,
};

export const tabsSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    addTab: (state, action: PayloadAction<TabProps>) => {
      state.tabs.push(action.payload);
      state.activeTab = action.payload.id;
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    setIsRenaming: (state, action: PayloadAction<string | null>) => {
      state.isRenaming = action.payload;
    },
    renameTab: (state, action: PayloadAction<RenameTabType>) => {
      const tabIndex = state.tabs.findIndex((t) => t.id === action.payload.id);
      state.tabs[tabIndex].label = action.payload.label;
    },
    removeTab: (state, action: PayloadAction<string>) => {
      const tabIndex = state.tabs.findIndex((t) => t.id === action.payload);
      if (tabIndex > -1) state.tabs.splice(tabIndex, 1);
      if (state.activeTab === action.payload && state.tabs.length > 0)
        state.activeTab = state.tabs[0].id;
    },
  },
});

export const { addTab, setActiveTab, setIsRenaming, renameTab, removeTab } =
  tabsSlice.actions;

export default tabsSlice.reducer;
