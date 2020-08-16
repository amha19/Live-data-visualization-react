import { takeEvery, call } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import { actions as MetricsActions, ApiErrorAction, NewMeasurementAction, MeasurementAction } from './reducer';
import { PayloadAction } from 'redux-starter-kit';

function* apiErrorReceived(action: PayloadAction<ApiErrorAction>) {
  yield call(toast.error, `Error Received: ${action.payload.error}`);
}

function* measurementRecived(action: PayloadAction<MeasurementAction>) {
  yield call(MetricsActions.singleMeasurementRecived, action.payload);
}

function* newMetricMeasurementRecived(action: PayloadAction<NewMeasurementAction>) {
  yield call(MetricsActions.newMeasurementRecived, action.payload);
}

export default function* watchApiCalls() {
  yield takeEvery(MetricsActions.weatherApiErrorReceived.type, apiErrorReceived);
  yield takeEvery(MetricsActions.singleMeasurementRecived.type, measurementRecived);
  yield takeEvery(MetricsActions.newMeasurementRecived.type, newMetricMeasurementRecived);
}
