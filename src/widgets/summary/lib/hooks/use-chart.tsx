import { useCallback, useState } from 'react';
import { AreaChart } from '../../ui/summary-charts/area-chart';
import { DayPoint } from '../../model/types';
import { BarChart } from '../../ui/summary-charts/bar-chart';
import { LineChart } from '../../ui/summary-charts/line-chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { AreaChartIcon, BarChartIcon, LineChartIcon } from 'lucide-react';

export type ChartType = 'area' | 'bar' | 'line';

const chartTypeMap: Record<ChartType, React.FC<{ data: DayPoint[] }>> = {
  'area': AreaChart,
  'bar': BarChart,
  'line': LineChart,
};

export const useChart = () => {
  const [chartType, setChartType] = useState<ChartType>('area');

  const onChartTypeChange = useCallback((chartType: ChartType) => {
    if (chartType) {
      setChartType(chartType);
    }
  }, []);

  const ChartSelect = () => {
    return (
      <Select value={chartType} onValueChange={onChartTypeChange}>
        <SelectTrigger className='lg:w-auto h-9 rounded-md px-3'>
          <SelectValue placeholder='Chart type' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='area'>
            <div className='flex items-center'>
              <AreaChartIcon className='size-4 mr-2 shrink-0' />
              <p className='line-clamp-1'>Area Chart</p>
            </div>
          </SelectItem>
          <SelectItem value='bar'>
            <div className='flex items-center'>
              <BarChartIcon className='size-4 mr-2 shrink-0' />
              <p className='line-clamp-1'>Bar Chart</p>
            </div>
          </SelectItem>
          <SelectItem value='line'>
            <div className='flex items-center'>
              <LineChartIcon className='size-4 mr-2 shrink-0' />
              <p className='line-clamp-1'>Line Chart</p>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    )
  };

  return {
    Chart: chartTypeMap[chartType],
    Select: ChartSelect,
  } as const;
};