import React, { useEffect } from 'react';
import { useSubscription, Provider, Client, defaultExchanges, subscriptionExchange } from 'urql';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { useDispatch, useSelector } from 'react-redux';
import { IState } from '../../store';
import { actions } from './reducer';
import CurrentValue from './CurrentValue';
import { LinearProgress } from '@material-ui/core';

const subscriptionClient = new SubscriptionClient('wss://react.eogresources.com/graphql', { reconnect: true });

const client = new Client({
  url: 'https://react.eogresources.com/graphql',
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription(operation) {
        return subscriptionClient.request(operation);
      },
    }),
  ],
});

export default () => {
  return (
    <Provider value={client}>
      <MetricsSubscription />
    </Provider>
  );
};

const MEASUREMENT_SUBSCRIPTION = `
    subscription {
        newMeasurement{
            metric
            value
            at
            unit
            }
        }
    `;

const getMetrics = (state: IState) => {
  const { metricsNamesArray, metricsMeasurementsArray } = state.metrics;
  return {
    metricsNamesArray,
    metricsMeasurementsArray,
  };
};

const MetricsSubscription = () => {
  const dispatch = useDispatch();

  const { metricsNamesArray } = useSelector(getMetrics);

  const [result] = useSubscription({
    query: MEASUREMENT_SUBSCRIPTION,
  });

  const { data, error } = result;

  useEffect(() => {
    if (error) {
      dispatch(actions.weatherApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { newMeasurement } = data;
    dispatch(actions.newMeasurementRecived(newMeasurement));
    dispatch(actions.storeNewMeasurements(newMeasurement));
  }, [metricsNamesArray, dispatch, data, error]);

  if (!data) return <LinearProgress />;

  return <CurrentValue />;
};
