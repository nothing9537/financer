import { ResponsiveContainer, PieChart as RePieChart, Legend, Pie, Cell, Tooltip } from 'recharts';

import { formatPercentage } from '@/shared/lib/utils/format';
import { CategoryTooltip } from '@/shared/components/custom-chart-tooltip';

import { CategoryPoint } from '../../model/types';
import { COLORS } from '../../lib/consts/colors';

export const PieChart: React.FC<{ data: CategoryPoint[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width='100%' height={384}>
      <RePieChart>
        <Legend
          layout='horizontal'
          verticalAlign='bottom'
          align='right'
          iconType='circle'
          content={({ payload }) => (
            <ul className='flex flex-col space-y-2'>
              {payload?.map((entry, index: number) => {
                console.log(entry);

                return (
                  <li
                    key={`item-${index}`}
                    className='flex items-center space-x-2'
                  >
                    <span className='size-2 rounded-full' style={{ backgroundColor: entry.color }} />
                    <div className='space-x-1'>
                      <span className='text-sm text-muted-foreground'>
                        {entry.value}
                      </span>
                      <span className='text-sm'>
                        {formatPercentage(entry.payload?.value * 100)}
                      </span>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        />
        <Tooltip content={CategoryTooltip} />
        <Pie
          data={data}
          cx='50%'
          cy='50%'
          outerRadius={90}
          innerRadius={60}
          paddingAngle={2}
          fill='#8884d8'
          dataKey='value'
          labelLine={false}
        >
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </RePieChart>
    </ResponsiveContainer>
  );
};