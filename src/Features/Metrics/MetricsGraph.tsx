import React from 'react';
import { useSelector } from 'react-redux';
import { Line } from 'react-chartjs-2';
import moment from 'moment';
import { IState } from '../../store';

const getMetrics = (state: IState) => {
  const { selectedNames, metricsMeasurementsArray } = state.metrics;
  return {
    selectedNames,
    metricsMeasurementsArray,
  };
};

export default () => {
  const { selectedNames, metricsMeasurementsArray } = useSelector(getMetrics);

  type ImetricData = {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      // backgroundColor: string[];
      borderWidth: number;
      fill: boolean;
      pointRadius: number;
      borderColor: string[];
      yAxisID: string;
    }[];
  };

  let metricData = {} as ImetricData;

  const metricName = selectedNames[0];

  const metricLabels = metricsMeasurementsArray
    .filter(e => e.metric === metricName)
    .map(e => moment(e.at).format('LT'));

  let chartDatasets: any[] = [];

  selectedNames.forEach(name => {
    let num = 0;
    let color = [] as string[];

    switch (name) {
      case 'oilTemp':
        color = ['rgb(51, 51, 51)'];
        break;
      case 'waterTemp':
        color = ['rgb(51, 102, 255)'];
        break;
      case 'flareTemp':
        color = ['rgb(255, 83, 26)'];
        break;
      case 'casingPressure':
        color = ['rgb(68, 204, 0)'];
        break;
      case 'tubingPressure':
        color = ['rgb(117, 117, 163)'];
        break;
      case 'injValveOpen':
        color = ['rgb(230, 230, 0)'];
        break;
      default:
        color = ['rgb(230, 230, 230)'];
    }

    for (let i of metricsMeasurementsArray) {
      const arrayOfValueData = metricsMeasurementsArray.filter(e => e.metric === name).map(element => element.value);

      if (name === i.metric && num === 0) {
        chartDatasets.push({
          label: `${name} Value`,
          data: arrayOfValueData,
          borderWidth: 1,
          fill: false,
          pointRadius: 1,
          borderColor: color,
          yAxisID: name,
        });
        num++;
      }
    }
  });

  //   console.log(chartDatasets);

  metricData = {
    labels: metricLabels,
    datasets: chartDatasets,
  };

  let arraysOfyAxes: any[] = [];

  selectedNames.forEach(name => {
    arraysOfyAxes.push({
      id: name,
      ticks: {
        autoSkip: true,
        maxTicksLimit: 10,
        beginAtZero: false,
        // backdropPaddingY,
        showLabelBackdrop: true,
        backdropColor: ['rgba(0, 64, 255, 0.2)'],
      },
      gridLines: {
        display: true,
      },
    });
  });

  //   console.log(arraysOfyAxes);

  return (
    <React.Fragment>
      <Line
        data={metricData}
        options={{
          responsive: true,
          title: { text: `Metrics scale`, display: true },
          scales: {
            yAxes: arraysOfyAxes,
            xAxes: [
              {
                gridLines: {
                  display: false,
                },
                ticks: {
                  stepSize: 2,
                },
              },
            ],
          },
        }}
      />
    </React.Fragment>
  );
};
