import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
// import InputLabel from '@material-ui/core/InputLabel';
// import Grid from '@material-ui/core/Grid';
// import Fab from '@material-ui/core/Fab';
// import CloseIcon from '@material-ui/icons/Close';
// import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import { IState } from '../../store';
import { actions } from './reducer';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const getMetrics = (state: IState) => {
  const { metricsNamesArray, currentSingleName } = state.metrics;
  return {
    metricsNamesArray,
    currentSingleName,
  };
};

export default () => {
  const dispatch = useDispatch();

  const { metricsNamesArray, currentSingleName } = useSelector(getMetrics);

  const classes = useStyles();

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const name = event.target.value as string;
    dispatch(actions.setSelectedMetricName(name));
  };

  return (
    <React.Fragment>
      <FormControl variant="outlined" fullWidth={true} className={classes.formControl}>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={currentSingleName}
          onChange={handleChange}
        >
          <MenuItem value={currentSingleName}>
            <em>{currentSingleName}</em>
          </MenuItem>
          {metricsNamesArray.map((mName, i) => (
            <MenuItem key={i} value={mName}>
              {mName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </React.Fragment>
  );
};
