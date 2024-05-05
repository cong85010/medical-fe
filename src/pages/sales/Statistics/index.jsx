import React from 'react';
import { Line } from '@ant-design/charts';

const StatisticsPage = () => {
  // Sample data
  const data = [
    { year: '2020', value: 3 },
    { year: '2021', value: 4 },
    { year: '2022', value: 3.5 },
    { year: '2023', value: 5 },
    { year: '2024', value: 4.9 },
  ];

  // Configurations for the line chart
  const config = {
    data,
    xField: 'year',
    yField: 'value',
    height: 400,
    padding: 'auto',
    xAxis: {
      type: 'cat',
    },
    yAxis: {
      label: {
        formatter: (v) => `${v}%`,
      },
    },
    label: {},
    point: {
      size: 5,
      shape: 'diamond',
    },
  };

  return <Line {...config} />;
};

export default StatisticsPage;
