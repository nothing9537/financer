import { LucideIcon } from 'lucide-react';

export type DayPoint = { date: string, expenses: number; income: number; }
export type CategoryPoint = { name: string, value: number };

export type ChartType = 'area' | 'bar' | 'line' | 'radar' | 'pie' | 'radial';

export type DayChartTypes = 'area' | 'bar' | 'line';
export type CategoryChartTypes = 'radar' | 'pie' | 'radial';

export const isDayChart = (type: ChartType): type is DayChartTypes => {
  return ['area', 'bar', 'line'].includes(type);
};

export type ChartDataType<T extends ChartType> = T extends DayChartTypes
  ? DayPoint
  : T extends CategoryChartTypes
  ? CategoryPoint
  : never;

export type ChartComponent<T extends ChartType> = React.FC<{ data: ChartDataType<T>[] }>;

export type ChartTypeToUIMapType = {
  [K in ChartType]: ChartComponent<K>;
};

export type ChartTypeToSelectItemMapType = Record<ChartType, {
  label: string,
  value: ChartType,
  Icon: LucideIcon
}>;

export interface UseChartArgs<T extends ChartType> {
  charts: T[];
  defaultValue?: T;
}