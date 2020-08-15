import React, { useEffect } from 'react';
import { Provider, createClient, useQuery } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

// const query = `
//     query {
//         getMetrics
//       }
//     `;

const query = `
    query ($input: MeasurementQuery) {
        getMeasurements(input: $input){
            value
            metric
            unit
            at
        }
    }    
  `;

const timeStamp = +new Date();

export default () => {
  return (
    <Provider value={client}>
      <MetricsQueries />
    </Provider>
  );
};

const MetricsQueries = () => {
  const timeBefore = timeStamp;
  const timeAfter = timeBefore - 10000;

  const input = {
    metricName: 'waterTemp',
    before: timeBefore,
    after: timeAfter,
  };

  const [result] = useQuery({
    query,
    variables: {
      input,
    },
  });

  const { fetching, data, error } = result;

  useEffect(() => {
    if (error) {
      console.log(error.message);
      return;
    }

    if (!data) return;

    const { getMeasurements } = data;

    // console.log(getMeasurements);
  }, [data, error]);

  if (fetching) return <LinearProgress />;

  return <React.Fragment>Amha eog</React.Fragment>;
};
