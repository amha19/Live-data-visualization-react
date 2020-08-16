import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Provider, createClient, useQuery } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
import { IState } from '../../store';
import { actions } from './reducer';
import MetricsGraph from './MetricsGraph';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = `
      query ($input: [MeasurementQuery]) {
          getMultipleMeasurements(input: $input){
            metric
            measurements{
              metric
              unit
              value
              at
            }
          }
        }
      `;

const timeStamp = +new Date();

const getMetrics = (state: IState) => {
  const { selectedNames, currentSingleName } = state.metrics;
  return {
    selectedNames,
    currentSingleName,
  };
};

export type metricInput = {
  metricName: string;
  before: number;
  after: number;
};

export default () => {
  return (
    <Provider value={client}>
      <MultipleMeasurements />
    </Provider>
  );
};

const MultipleMeasurements = () => {
  const dispatch = useDispatch();

  const { selectedNames, currentSingleName } = useSelector(getMetrics);

  // Testing only for 1-minute interval
  const timeBefore = timeStamp;
  const timeAfter = timeBefore - 10000;
  // 1.8e+6;

  const input: metricInput[] = [];

  selectedNames.map(name => {
    return input.push({
      metricName: name,
      before: timeBefore,
      after: timeAfter,
    });
  });

  const [result] = useQuery({
    query,
    variables: {
      input,
    },
  });

  const { fetching, data, error } = result;

  useEffect(() => {
    if (error) {
      dispatch(actions.weatherApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { getMultipleMeasurements } = data;

    // console.log('inside useEffect: ', getMultipleMeasurements);

    getMultipleMeasurements.forEach((measurement: { metric: string; measurements: any }) => {
      if (measurement.metric === currentSingleName) {
        dispatch(actions.singleMeasurementRecived(measurement.measurements));
      }
    });
  }, [currentSingleName, dispatch, data, error]);

  if (fetching) return <LinearProgress />;

  return <MetricsGraph />;
};
