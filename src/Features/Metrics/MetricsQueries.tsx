import React, { useEffect } from 'react';
import { Provider, createClient, useQuery } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useDispatch, useSelector } from 'react-redux';
import { IState } from '../../store';
import { actions } from './reducer';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = `
    query {
        getMetrics
      }
    `;

const getMetrics = (state: IState) => {
  const { metricsNamesArray } = state.metrics;
  return {
    metricsNamesArray,
  };
};

// const query = `
//     query ($input: MeasurementQuery) {
//         getMeasurements(input: $input){
//             value
//             metric
//             unit
//             at
//         }
//     }
//   `;

// const timeStamp = +new Date();

export default () => {
  return (
    <Provider value={client}>
      <MetricsQueries />
    </Provider>
  );
};

const MetricsQueries = () => {
  const dispatch = useDispatch();

  const { metricsNamesArray } = useSelector(getMetrics);

  //   const timeBefore = timeStamp;
  //   const timeAfter = timeBefore - 10000;

  //   const input = {
  //     metricName: 'waterTemp',
  //     before: timeBefore,
  //     after: timeAfter,
  //   };

  const [result] = useQuery({ query });

  const { fetching, data, error } = result;

  useEffect(() => {
    if (error) {
      dispatch(actions.weatherApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { getMetrics } = data;
    // console.log(getMetrics);
    dispatch(actions.metricsNamesRecived(getMetrics));

    // console.log('From useEffect: ', metricsNamesArray);
  }, [metricsNamesArray, dispatch, data, error]);

  if (fetching) return <LinearProgress />;

  return <React.Fragment>Amha eog</React.Fragment>;
};
