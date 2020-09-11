import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { IState } from '../../store';
import LinearProgress from '@material-ui/core/LinearProgress';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const getMetrics = (state: IState) => {
  const { selectedNames, metricsMeasurementsArray } = state.metrics;
  return {
    selectedNames,
    metricsMeasurementsArray,
  };
};

export default () => {
  const { selectedNames, metricsMeasurementsArray } = useSelector(getMetrics);

  let metricData: any[] = [];

  if (!metricsMeasurementsArray[0]) return <LinearProgress />;

  metricsMeasurementsArray.forEach((item, index) => {
    if (index === 0) {
      for (const i of item.measurements) {
        metricData.push({
          at: i.at,
          [i.metric]: i.value,
        });
      }
    }

    if (index > 0) {
      metricData.forEach((el, i) => {
        item.measurements.forEach((element: any, index: number) => {
          if (i === index) {
            el[element.metric] = element.value;
          }
        });
      });
    }
  });

  const metricNameUnit: { name: string; unit: string }[] = [];

  selectedNames.forEach(name => {
    let valueUnit: string = '';
    if (name === 'casingPressure' || name === 'tubingPressure') {
      valueUnit = 'PSI';
    } else if (name === 'injValveOpen') {
      valueUnit = '%';
    } else {
      valueUnit = '°F';
    }

    metricNameUnit.push({
      name: name,
      unit: valueUnit,
    });
  });

  return (
    <React.Fragment>
      <ResponsiveContainer width={'99%'} height={500}>
        <LineChart data={metricData} margin={{ top: 20 }}>
          <XAxis
            dataKey="at"
            tickFormatter={tick => moment(tick).format('LT')}
            padding={{ left: 20, right: 0 }}
            tickSize={3}
            minTickGap={20}
          />
          {metricNameUnit.map((item, i) => {
            return (
              <YAxis
                key={i}
                yAxisId={item.unit}
                domain={['auto', 'auto']}
                padding={{ top: 0, bottom: 15 }}
                label={{ value: item.unit, angle: -90, position: 'insideTopRight', offset: -3 }}
                tickSize={3}
                tickFormatter={tick => (tick < 999 ? tick : `${(tick / 1000).toFixed(1)} k`)}
              />
            );
          })}
          <Tooltip labelFormatter={at => moment(at).format('MMM Do h:mm:ss a')} />
          {metricNameUnit.map((item, i) => {
            const cN = item.name.charCodeAt(0) - 96;
            const color = `hsl(${cN * 15}, ${cN * 4}%, 55%)`;
            return (
              <Line
                key={i}
                yAxisId={item.unit}
                type="monotone"
                dataKey={item.name}
                stroke={color}
                activeDot={{ r: 0 }}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
};
