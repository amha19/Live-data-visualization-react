import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Provider, createClient, useQuery } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
import { IState } from '../../store';
import { actions } from './reducer';

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
  const { metricsNamesArray, currentSingleName } = state.metrics;
  return {
    metricsNamesArray,
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

  const { metricsNamesArray, currentSingleName } = useSelector(getMetrics);

  const timeBefore = timeStamp;
  // Use fewer milliseconds like 10000 for faster response
  const timeAfter = timeBefore - 1.8e6;
  // 1.8e6;

  const input: metricInput[] = [];

  metricsNamesArray.forEach(name => {
    input.push({
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
    dispatch(actions.multipleMeasurementRecived(getMultipleMeasurements));
  }, [currentSingleName, dispatch, data, error]);

  if (fetching) return <LinearProgress />;

  return null;
};
