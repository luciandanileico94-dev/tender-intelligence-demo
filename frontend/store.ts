import { configureStore, createSlice, type PayloadAction } from '@reduxjs/toolkit';

type DashboardState = {
  query: string;
  selectedTenderId: string | null;
  evidenceIndex: number | null;
};

const initialState: DashboardState = { query: '', selectedTenderId: null, evidenceIndex: null };

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => { state.query = action.payload; },
    selectTender: (state, action: PayloadAction<string>) => {
      state.selectedTenderId = action.payload;
      state.evidenceIndex = null;
    },
    openEvidence: (state, action: PayloadAction<number>) => { state.evidenceIndex = action.payload; },
    closeEvidence: (state) => { state.evidenceIndex = null; },
    clearSelection: (state) => { state.selectedTenderId = null; state.evidenceIndex = null; },
  },
});

export const { setQuery, selectTender, openEvidence, closeEvidence, clearSelection } = dashboardSlice.actions;
export const store = configureStore({ reducer: { dashboard: dashboardSlice.reducer } });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
