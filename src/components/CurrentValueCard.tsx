import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { IState } from '../store';
import { actions } from '../Features/Metrics/reducer';

const getMetrics = (state: IState) => {
  const { selectedCurrentValues } = state.metrics;
  return {
    selectedCurrentValues,
  };
};

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 100,
  },
  title: {
    fontSize: 14,
  },
  gridDisplay: {
    padding: theme.spacing(1),
  },
  button: {
    color: '#ccc',
    '&:hover': {
      color: '#000',
      transitionProperty: 'color',
      transitionDuration: '0.3s',
    },
  },
}));

export default () => {
  const dispatch = useDispatch();

  const classes = useStyles();
  const { selectedCurrentValues } = useSelector(getMetrics);

  const removeDisplay = (name: string) => {
    dispatch(actions.removeMetricDisplay(name));
  };

  return (
    <React.Fragment>
      {selectedCurrentValues.map((item, i) => {
        return (
          <Grid key={i} item md={3} className={classes.gridDisplay}>
            <Card className={classes.root}>
              <CardContent>
                <Typography className={classes.title} color="textSecondary" style={{ color: item.color }} gutterBottom>
                  {item.name}
                </Typography>
                <Typography variant="h5" component="h2">
                  {item.value}
                </Typography>
                <Typography variant="body2" component="p">
                  {item.unit}
                </Typography>
              </CardContent>
              <CardActions style={{ marginTop: '-16px' }}>
                <Button size="small" onClick={() => removeDisplay(item.name)}>
                  <span className={classes.button}>close</span>
                </Button>
              </CardActions>
            </Card>
          </Grid>
        );
      })}
    </React.Fragment>
  );
};
