import { configureStore, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { defaultRequirementStates } from './demoData';
import type { DemoState, RequirementState } from './types';

export const STORAGE_KEY = 'tender-intelligence-demo-state';
export const initialDemoState: DemoState = { requirements: defaultRequirementStates, note: '', decision: null };

const demoSlice = createSlice({
  name: 'demo',
  initialState: initialDemoState,
  reducers: {
    setRequirement: (state, action: PayloadAction<{ id: string; value: RequirementState }>) => { state.requirements[action.payload.id] = action.payload.value; state.decision = null; },
    setNote: (state, action: PayloadAction<string>) => { state.note = action.payload; },
    setDecision: (state, action: PayloadAction<'go' | 'no-go'>) => { state.decision = action.payload; },
    resetDemo: () => initialDemoState,
    hydrate: (_state, action: PayloadAction<DemoState>) => action.payload,
  },
});

export const { setRequirement, setNote, setDecision, resetDemo, hydrate } = demoSlice.actions;
export const store = configureStore({ reducer: { demo: demoSlice.reducer } });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
