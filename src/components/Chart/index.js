import React, { PureComponent } from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export default function Example({ data }) {
  const dataMap = [
    {
      name: 'Tháng 1',
      selled: data.selled.month_1,
      actived: data.actived.month_1
    },
    {
      name: 'Tháng 2',
      selled: data.selled.month_2,
      actived: data.actived.month_2
    },
    {
      name: 'Tháng 3',
      selled: data.selled.month_3,
      actived: data.actived.month_3
    },
    {
      name: 'Tháng 4',
      selled: data.selled.month_4,
      actived: data.actived.month_4
    },
    {
      name: 'Tháng 5',
      selled: data.selled.month_5,
      actived: data.actived.month_5
    },
    {
      name: 'Tháng 6',
      selled: data.selled.month_6,
      actived: data.actived.month_6
    },
    {
      name: 'Tháng 7',
      selled: data.selled.month_7,
      actived: data.actived.month_7
    },
    {
      name: 'Tháng 8',
      selled: data.selled.month_8,
      actived: data.actived.month_8
    },
    {
      name: 'Tháng 9',
      selled: data.selled.month_9,
      actived: data.actived.month_9
    },
    {
      name: 'Tháng 10',
      selled: data.selled.month_10,
      actived: data.actived.month_10
    },
    {
      name: 'Tháng 11',
      selled: data.selled.month_11,
      actived: data.actived.month_11
    },
    {
      name: 'Tháng 12',
      selled: data.selled.month_12,
      actived: data.actived.month_12
    }
  ];

  return (
    <BarChart
      width={1000}
      height={400}
      data={dataMap}
      margin={{
        top: 20,
        right: 30,
        left: 20,
        bottom: 5
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar
        dataKey="actived"
        stackId="a"
        name="Thiết bị đã kích hoạt"
        fill="#F7685B"
      />
      <Bar dataKey="selled" stackId="a" name="Thiết bị đã bán" fill="#456083" />
    </BarChart>
  );
}
