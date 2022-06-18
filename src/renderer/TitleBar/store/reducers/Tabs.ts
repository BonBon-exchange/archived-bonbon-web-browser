import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type TabProps = {
  id: string;
  label: string;
};

type TabsState = {
  tabs: TabProps[];
  activeTab: string;
};

const initialState: TabsState = {
  tabs: [],
  activeTab: '',
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
  },
});

export const { addTab, setActiveTab } = tabsSlice.actions;

export default tabsSlice.reducer;
