import { takeEvery, call } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import { actions as MetricsActions, ApiErrorAction, NewMeasurementAction, MultipleMeasurementsAction } from './reducer';
import { PayloadAction } from 'redux-starter-kit';

function* apiErrorReceived(action: PayloadAction<ApiErrorAction>) {
  yield call(toast.error, `Error Received: ${action.payload.error}`);
}

function* measurementRecived(action: PayloadAction<MultipleMeasurementsAction[]>) {
  yield call(MetricsActions.multipleMeasurementRecived, action.payload);
}

function* newMetricMeasurementRecived(action: PayloadAction<NewMeasurementAction>) {
  yield call(MetricsActions.newMeasurementRecived, action.payload);
}

function* currentMetricsValues(action: PayloadAction<any[]>) {
  yield call(MetricsActions.storeCurrentValues, action.payload);
}

export default function* watchApiCalls() {
  yield takeEvery(MetricsActions.weatherApiErrorReceived.type, apiErrorReceived);
  yield takeEvery(MetricsActions.multipleMeasurementRecived.type, measurementRecived);
  yield takeEvery(MetricsActions.newMeasurementRecived.type, newMetricMeasurementRecived);
  yield takeEvery(MetricsActions.storeCurrentValues.type, currentMetricsValues);
}
