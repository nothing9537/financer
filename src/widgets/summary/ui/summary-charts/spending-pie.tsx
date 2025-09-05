'use client';

import { FileSearch } from 'lucide-react';
import { useGetSummary } from '@/entities/summary';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

import { useChart } from '../../lib/hooks/use-chart';
import { ChartLoading } from './chart-loading';
import { ChartError } from './chart-error';

export const SpendingPie: React.FC = () => {
  const { data, isLoading, error } = useGetSummary();
  const { Chart, Select } = useChart({ charts: ['pie', 'radar', 'radial'] })

  if (isLoading) {
    return (
      <ChartLoading />
    );
  }

  if (!data || error) {
    return (
      <ChartError errorMessage={error?.message} />
    );
  }

  return (
    <Card className='border-none drop-shadow-sm'>
      <CardHeader className='flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between'>
        <CardTitle className='text-xl line-clamp-1'>
          Categories
        </CardTitle>
        <Select />
      </CardHeader>
      <CardContent>
        {data?.categories?.length === 0 ? (
          <div className='flex flex-col gap-y-4 items-center justify-center h-96 w-full text-muted-foreground'>
            <FileSearch className='size-6' />
            <p className='text-sm'>
              No data for this period
            </p>
          </div>
        ) : (
          <Chart data={data.categories} />
        )}
      </CardContent>
    </Card>
  );
};