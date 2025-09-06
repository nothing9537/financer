import { ResponsiveContainer, LineChart as ReLineChart, CartesianGrid, XAxis, Line, Tooltip } from 'recharts';
import { format } from 'date-fns';

import { CustomChartTooltip } from '@/shared/components/custom-chart-tooltip';

import { DayPoint } from '../../model/types';

export const LineChart: React.FC<{ data: DayPoint[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width='100%' height={384}>
      <ReLineChart data={data}>
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
        <Line
          dot={false}
          dataKey='income'
          stroke='#3d82f6'
          strokeWidth={2}
          className='drop-shadow-sm'
        />
        <Line
          dot={false}
          dataKey='expenses'
          stroke='#f43f5e'
          strokeWidth={2}
          className='drop-shadow-sm'
        />
      </ReLineChart>
    </ResponsiveContainer>
  );
};