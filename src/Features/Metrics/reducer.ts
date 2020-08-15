import { createSlice, PayloadAction } from 'redux-starter-kit';

export type ApiErrorAction = {
  error: string;
};

const initialState = {
  metricsNamesArray: [] as string[],
  isMetricSelected: false,
  currentSingleName: 'Select metrics',
  selectedNames: [] as string[],
};

const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    metricsNamesRecived: (state, action: PayloadAction<string[]>) => {
      state.metricsNamesArray = action.payload;
    },

    setSelectedMetricName: (state, action: PayloadAction<string>) => {
      const alreadyin = state.selectedNames.some(name => name === action.payload);
      if (alreadyin) return;
      state.selectedNames = [...state.selectedNames, action.payload];
      state.currentSingleName = action.payload;
      state.isMetricSelected = true;
    },

    weatherApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
