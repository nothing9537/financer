import { ResponsiveContainer, BarChart as ReBarChart, CartesianGrid, XAxis, Bar, Tooltip } from 'recharts';
import { format } from 'date-fns';

import { CustomChartTooltip } from '@/shared/components/custom-chart-tooltip';

import { DayPoint } from '../../model/types';

export const BarChart: React.FC<{ data: DayPoint[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width='100%' height={384}>
      <ReBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey="date"
          tickFormatter={(value) => format(value, 'dd MMM')}
          style={{ fontSize: '12px' }}
          tickMargin={16}
        />
        <Tooltip content={CustomChartTooltip} />
        <Bar
          dataKey='income'
          fill='#3d82f6'
          className='drop-shadow-sm'
        />
        <Bar
          dataKey='expenses'
          fill='#f43f5e'
          className='drop-shadow-sm'
        />
      </ReBarChart>
    </ResponsiveContainer>
  );
};