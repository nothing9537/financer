'use client';

import { ChartWrapper } from './chart-wrapper';
import { SpendingPie } from './spending-pie';

export const SummaryCharts: React.FC = () => {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-6 gap-8'>
      <div className='col-span-1 lg:col-span-3 xl:col-span-4'>
        <ChartWrapper />
      </div>
      <div className='col-span-1 lg:col-span-3 xl:col-span-2'>
        <SpendingPie />
      </div>
    </div>
  );
};