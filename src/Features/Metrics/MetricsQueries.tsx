import React, { useEffect } from 'react';
import { Provider, createClient, useQuery } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useDispatch, useSelector } from 'react-redux';
import { IState } from '../../store';
import { actions } from './reducer';
import Dropdown from './Dropdown';
import MultipleMeasurements from './MultipleMeasurements';
import MetricsSubscription from './MetricsSubscription';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = `
    query {
        getMetrics
      }
    `;

const getMetrics = (state: IState) => {
  const { metricsNamesArray, isMetricSelected } = state.metrics;
  return {
    metricsNamesArray,
    isMetricSelected,
  };
};

export default () => {
  return (
    <Provider value={client}>
      <MetricsQueries />
    </Provider>
  );
};

const MetricsQueries = () => {
  const dispatch = useDispatch();

  const { metricsNamesArray, isMetricSelected } = useSelector(getMetrics);

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

  return (
    <React.Fragment>
      <Dropdown />
      {isMetricSelected ? (
        <React.Fragment>
          <MultipleMeasurements />
          <MetricsSubscription />
        </React.Fragment>
      ) : null}
    </React.Fragment>
  );
};
