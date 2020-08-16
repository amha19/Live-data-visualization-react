import { useEffect } from 'react';
import { IState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import { actions } from './reducer';

const getMetrics = (state: IState) => {
  const { selectedNames, newMetircsValues } = state.metrics;
  return {
    selectedNames,
    newMetircsValues,
  };
};

export default () => {
  const { selectedNames, newMetircsValues } = useSelector(getMetrics);

  // sorts array of new metrics values based on timestamp
  const sortedMetrics = [...newMetircsValues];
  sortedMetrics.sort((a, b) => {
    return a.at - b.at;
  });

  const lastUnitvalues: any[] = [];

  if (sortedMetrics.length > 5) {
    const len = sortedMetrics.length - 1;
    // pushes the latest value
    for (let i = len; i >= len - 5; i--) {
      lastUnitvalues.push({
        name: sortedMetrics[i].metric,
        value: newMetircsValues[i].value,
        unit: newMetircsValues[i].unit,
      });
    }
  }

  const selectedUnitVal: any[] = [];

  // pushes the latest values for the selected metrics
  selectedNames.forEach(name => {
    for (let i of lastUnitvalues) {
      if (name === i.name)
        selectedUnitVal.push({
          name: i.name,
          value: i.value,
          unit: i.unit,
        });
    }
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.storeCurrentValues(selectedUnitVal));
    // console.log('Selected: ', selectedUnitVal);
  }, [newMetircsValues, dispatch]);

  return null;
};
