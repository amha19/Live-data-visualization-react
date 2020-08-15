import { createSlice, PayloadAction } from 'redux-starter-kit';

export type ApiErrorAction = {
  error: string;
};

const initialState = {
  metricsNamesArray: [] as string[],
};

const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    metricsNamesRecived: (state, action: PayloadAction<string[]>) => {
      state.metricsNamesArray = action.payload;
    },

    weatherApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
