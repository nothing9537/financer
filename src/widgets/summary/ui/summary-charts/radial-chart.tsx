import { ResponsiveContainer, RadialBar, RadialBarChart, Legend } from 'recharts';

import { formatAmount } from '@/shared/lib/utils/format';

import { CategoryPoint } from '../../model/types';
import { COLORS } from '../../lib/consts/colors';

export const RadialChart: React.FC<{ data: CategoryPoint[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width='100%' height={384}>
      <RadialBarChart
        cx={'50%'}
        cy={'30%'}
        barSize={10}
        innerRadius={'90%'}
        outerRadius={'40%'}
        data={data.map((item, index) => ({
          ...item,
          fill: COLORS[index % COLORS.length]
        }))}
      >
        <RadialBar
          label={{
            position: 'insideStart',
            fill: '#fff',
            fontSize: '12px'
          }}
          background
          dataKey={'value'}
        />
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
                        -{formatAmount(entry.payload?.value)}
                      </span>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
};