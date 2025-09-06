import { AreaChartIcon, BarChartIcon, LineChartIcon, PieChartIcon, RadarIcon, TargetIcon } from 'lucide-react';

import { ChartTypeToSelectItemMapType, ChartTypeToUIMapType } from '../../model/types';
import { AreaChart } from '../../ui/summary-charts/area-chart';
import { BarChart } from '../../ui/summary-charts/bar-chart';
import { LineChart } from '../../ui/summary-charts/line-chart';
import { PieChart } from '../../ui/summary-charts/pie-chart';
import { RadarChart } from '../../ui/summary-charts/radar-chart';
import { RadialChart } from '../../ui/summary-charts/radial-chart';

export const ChartTypeToUIMap: ChartTypeToUIMapType = {
  'area': AreaChart,
  'bar': BarChart,
  'line': LineChart,
  'pie': PieChart,
  'radar': RadarChart,
  'radial': RadialChart,
};

export const ChartTypeToSelectItemMap: ChartTypeToSelectItemMapType = {
  'area': { value: 'area', label: 'Area chart', Icon: AreaChartIcon },
  'bar': { value: 'bar', label: 'Bar chart', Icon: BarChartIcon },
  'line': { value: 'line', label: 'Line chart', Icon: LineChartIcon },
  'pie': { value: 'pie', label: 'Pie chart', Icon: PieChartIcon },
  'radar': { value: 'radar', label: 'Radar chart', Icon: RadarIcon },
  'radial': { value: 'radial', label: 'Radial chart', Icon: TargetIcon },
};