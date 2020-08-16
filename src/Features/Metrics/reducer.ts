import { createSlice, PayloadAction } from 'redux-starter-kit';

export type ApiErrorAction = {
  error: string;
};

export type NewMeasurementAction = {
  at: number;
  metric: string;
  unit: string;
  value: number;
};

export type MeasurementAction = NewMeasurementAction[];

const initialState = {
  metricsNamesArray: [] as string[],
  isMetricSelected: false,
  currentSingleName: 'Select metrics',
  selectedNames: [] as string[],
  metricsMeasurementsArray: [] as MeasurementAction,
  newMetircsValues: [] as MeasurementAction,
  selectedCurrentValues: [] as any[],
};

const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    weatherApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,

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

    singleMeasurementRecived: (state, action: PayloadAction<MeasurementAction>) => {
      state.metricsMeasurementsArray = [...state.metricsMeasurementsArray, ...action.payload];
    },

    newMeasurementRecived: (state, action: PayloadAction<NewMeasurementAction>) => {
      // filters selected metrics. Shift out the earliest value and pops in the current value
      let arr1: MeasurementAction = [...state.metricsMeasurementsArray];
      let arr2: MeasurementAction = arr1.filter(obj => obj.metric === action.payload.metric);
      let arr3: MeasurementAction = arr1.filter(obj => obj.metric !== action.payload.metric);
      let arr4: MeasurementAction = [];
      arr2.shift();
      arr2.push(action.payload);
      arr4 = [...arr2, ...arr3];

      state.metricsMeasurementsArray = arr4;
    },

    storeNewMeasurements: (state, action: PayloadAction<NewMeasurementAction>) => {
      state.newMetircsValues = [...state.newMetircsValues, action.payload];
    },

    removeMetricDisplay: (state, action: PayloadAction<string>) => {
      // console.log(action.payload);
      let arr1 = [...state.selectedNames];
      let arr2 = [...state.metricsMeasurementsArray];

      state.selectedNames = arr1.filter(element => element !== action.payload);
      state.metricsMeasurementsArray = arr2.filter(element => element.metric !== action.payload);

      //   console.log(state.selectedNames);
      state.currentSingleName = 'Select metrics';
      if (state.selectedNames.length === 0) state.isMetricSelected = false;
    },

    storeCurrentValues: (state, action: PayloadAction<any[]>) => {
      // console.log('reducer: ', action.payload);
      state.selectedCurrentValues = action.payload;
    },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
