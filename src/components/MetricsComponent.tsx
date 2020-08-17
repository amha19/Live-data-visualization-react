import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
// import Card from '@material-ui/core/Card';
// import CardActions from '@material-ui/core/CardActions';
// import CardContent from '@material-ui/core/CardContent';
// import Button from '@material-ui/core/Button';
// import Typography from '@material-ui/core/Typography';
// import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Dropdown from '../Features/Metrics/Dropdown';
import { IState } from '../store';
import MetricsGraph from '../Features/Metrics/MetricsGraph';
import CurrentValueCard from './CurrentValueCard';

const getMetrics = (state: IState) => {
  const { isMetricSelected } = state.metrics;
  return {
    isMetricSelected,
  };
};

const useStyles = makeStyles(theme => ({
  gridMargin: {
    marginTop: theme.spacing(1),
    backgroundColor: 'rgb(250,250,250)',
  },
  gridColor: {
    backgroundColor: 'rgb(250,250,250)',
  },
}));

export default () => {
  const classes = useStyles();
  const { isMetricSelected } = useSelector(getMetrics);
  // console.log(selectedCurrentValues);
  return (
    <React.Fragment>
      <Grid container>
        <Grid item xs={'auto'} md={2}></Grid>
        <Grid item xs={'auto'} md={8} container>
          <Grid item container className={classes.gridColor}>
            <Grid item xs={12} md={3} className={classes.gridColor}>
              <Dropdown />
            </Grid>
            <Grid item xs={6} md={9}>
              <Grid item container justify="flex-end">
                {isMetricSelected ? <CurrentValueCard /> : null}
              </Grid>
            </Grid>
          </Grid>
          <Grid container className={classes.gridMargin}>
            {isMetricSelected ? <MetricsGraph /> : null}
          </Grid>
        </Grid>
        <Grid item xs={'auto'} md={2}></Grid>
      </Grid>
    </React.Fragment>
  );
};