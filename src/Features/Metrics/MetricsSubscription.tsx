import React, { useEffect } from 'react';
import { useSubscription, Provider, Client, defaultExchanges, subscriptionExchange } from 'urql';
import { SubscriptionClient } from 'subscriptions-transport-ws';

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

const MetricsSubscription = () => {
  const [result] = useSubscription({
    query: MEASUREMENT_SUBSCRIPTION,
  });

  const { data, error } = result;

  useEffect(() => {
    if (error) {
      console.log(error.message);
      return;
    }
    if (!data) return;
    const { newMeasurement } = data;

    // console.log(newMeasurement);
  }, [data, error]);

  if (!data) return <p>Loading...</p>;

  return <React.Fragment>Subscription</React.Fragment>;
};
