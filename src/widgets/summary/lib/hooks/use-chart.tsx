import { useCallback, useState } from 'react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

import { ChartType, UseChartArgs, ChartDataType } from '../../model/types';
import { ChartTypeToSelectItemMap, ChartTypeToUIMap } from '../consts/mappers';
import { usePaywall } from '@/entities/subscriptions';

export function useChart<T extends ChartType>({ charts, defaultValue }: UseChartArgs<T>) {
  const [chartType, setChartType] = useState<T>(defaultValue ?? charts[0]);
  const { shouldBlock, triggerPaywall } = usePaywall();

  const onChartTypeChange = useCallback((newType: T) => {
    if (shouldBlock) {
      triggerPaywall();

      return;
    }

    if (newType) {
      setChartType(newType);
    }
  }, [shouldBlock, triggerPaywall]);

  const ChartSelect = () => {
    return (
      <Select value={chartType} onValueChange={onChartTypeChange}>
        <SelectTrigger className='lg:w-auto h-9 rounded-md px-3'>
          <SelectValue placeholder='Chart type' />
        </SelectTrigger>
        <SelectContent>
          {charts.map((type) => {
            const { Icon, label, value } = ChartTypeToSelectItemMap[type];

            return (
              <SelectItem value={value} key={type}>
                <div className='flex items-center'>
                  <Icon className='size-4 mr-2 shrink-0' />
                  <p className='line-clamp-1'>{label}</p>
                </div>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    )
  };

  return {
    Chart: ChartTypeToUIMap[chartType] as React.FC<{ data: ChartDataType<T>[] }>,
    Select: ChartSelect,
  } as const;
};