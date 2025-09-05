'use client';

import { FileSearch, Loader2 } from 'lucide-react';

import { useGetSummary } from '@/entities/summary';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

import { useChart } from '../../lib/hooks/use-chart';
import { Skeleton } from '@/shared/ui/skeleton';
import React from 'react';

const ChartLoading: React.FC = () => {
  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 lg:w-32 w-full" />
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full flex items-center justify-center">
          <Loader2 className="h-6 w-6 text-slate-300 animate-spin" />
        </div>
      </CardContent>
    </Card>
  );
};

const ChartError: React.FC<{ errorMessage?: string }> = ({ errorMessage }) => {
  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
        <CardTitle className='text-xl line-clamp-1'>
          Transactions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 w-full flex items-center justify-center">
          {errorMessage}
        </div>
      </CardContent>
    </Card>
  );
};

export const ChartWrapper: React.FC = () => {
  const { data, isLoading, error } = useGetSummary();
  const { Select, Chart } = useChart();

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
          Transactions
        </CardTitle>
        <Select />
      </CardHeader>
      <CardContent>
        {data?.days?.length === 0 ? (
          <div className='flex flex-col gap-y-4 items-center justify-center h-96 w-full text-muted-foreground'>
            <FileSearch className='size-6' />
            <p className='text-sm'>
              No data for this period
            </p>
          </div>
        ) : (
          <Chart data={data.days} />
        )}
      </CardContent>
    </Card>
  );
};