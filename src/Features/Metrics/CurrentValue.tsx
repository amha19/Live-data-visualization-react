import React from 'react';
import { IState } from '../../store';
import { useSelector } from 'react-redux';

const getMetrics = (state: IState) => {
  const { metricsNamesArray, newMetircsValues } = state.metrics;
  return {
    metricsNamesArray,
    newMetircsValues,
  };
};

export default () => {
  const { metricsNamesArray, newMetircsValues } = useSelector(getMetrics);

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

  const chosenUnitVal: any[] = [];

  // pushes the latest values for the selected metrics
  metricsNamesArray.forEach(name => {
    for (let i of lastUnitvalues) {
      if (name === i.name)
        chosenUnitVal.push({
          name: i.name,
          value: i.value,
          unit: i.unit,
        });
    }
  });

  //   console.log('selected: ', chosenUnitVal);

  const displayValue = chosenUnitVal.map((item, i) => (
    <li key={i}>
      {item.name} : {item.value} {item.unit}
    </li>
  ));

  return (
    <React.Fragment>
      <ul>{displayValue}</ul>
    </React.Fragment>
  );
};
