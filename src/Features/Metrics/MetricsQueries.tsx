import React, { useEffect } from 'react';
import { Provider, createClient, useQuery } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';


const client = createClient({
    url: 'https://react.eogresources.com/graphql',
});

const query = `
    query {
        getMetrics
      }
    `;


export default () => {
    return (
        <Provider value={client}>
            <MetricsQueries />
        </Provider>
    );
};


const MetricsQueries = () => {

    const [result] = useQuery({ query });
    const { fetching, data, error } = result;

    useEffect(() => {
        if (error) {
            console.log(error.message);
            return;
        }

        if (!data) return;

        const { getMetrics } = data;

        console.log(getMetrics);
    }, [data, error]);

    if (fetching) return <LinearProgress />;

    return (
        <React.Fragment>
            Amha eog
        </React.Fragment>
    );
}
