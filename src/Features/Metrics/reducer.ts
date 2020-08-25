import { createSlice, PayloadAction } from 'redux-starter-kit';

export type ApiErrorAction = {
  error: string;
};

export type MetricsNamesState = string[];

export type NewMeasurementAction = {
  at: number;
  metric: string;
  unit: string;
  value: number;
};

export type NameValueUnit = {
  name: string;
  value: number;
  unit: string;
  color: string;
};

export type MultipleMeasurementsAction = {
  metric: string;
  measurements: NewMeasurementAction[];
};

const initialState = {
  metricsNamesArray: [] as MetricsNamesState,
  isMetricSelected: false,
  currentSingleName: 'Select metrics',
  selectedNames: [] as MetricsNamesState,
  metricsMeasurementsArray: [] as MultipleMeasurementsAction[],
  newMetircsValues: [] as NewMeasurementAction[],
  selectedCurrentValues: [] as NameValueUnit[],
};

const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    weatherApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,

    metricsNamesRecived: (state, action: PayloadAction<MetricsNamesState>) => {
      state.metricsNamesArray = action.payload;
    },

    setSelectedMetricName: (state, action: PayloadAction<string>) => {
      const alreadyin = state.selectedNames.some(name => name === action.payload);
      if (alreadyin) return;
      state.selectedNames = [...state.selectedNames, action.payload];
      state.currentSingleName = action.payload;
      state.isMetricSelected = true;
    },

    multipleMeasurementRecived: (state, action: PayloadAction<MultipleMeasurementsAction[]>) => {
      state.metricsMeasurementsArray = action.payload;
    },

    newMeasurementRecived: (state, action: PayloadAction<NewMeasurementAction>) => {
      // Loops through the measurements and
      // shift out the earliest value and pops in the current value
      let arr1: MultipleMeasurementsAction[] = [...state.metricsMeasurementsArray];
      for (const i of arr1) {
        if (i.metric === action.payload.metric) {
          i.measurements.shift();
          i.measurements.push(action.payload);
        }
      }

      state.metricsMeasurementsArray = arr1;
    },

    storeNewMeasurements: (state, action: PayloadAction<NewMeasurementAction>) => {
      state.newMetircsValues = [...state.newMetircsValues, action.payload];
    },

    removeMetricDisplay: (state, action: PayloadAction<string>) => {
      let arr1 = [...state.selectedNames];
      let arr2 = [...state.metricsMeasurementsArray];

      state.selectedNames = arr1.filter(element => element !== action.payload);
      state.metricsMeasurementsArray = arr2.filter(element => element.metric !== action.payload);

      state.currentSingleName = 'Select metrics';
      if (state.selectedNames.length === 0) state.isMetricSelected = false;
    },

    storeCurrentValues: (state, action: PayloadAction<any[]>) => {
      state.selectedCurrentValues = action.payload;
    },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
