'use client';

import { useSearchParams } from 'next/navigation';
import { FaArrowTrendDown, FaArrowTrendUp, FaPiggyBank } from 'react-icons/fa6';

import { SummaryCard, useGetSummary } from '@/entities/summary';
import { DataGrid } from '@/shared/components/data-grid';
import { formatDateRange } from '@/shared/lib/utils/format';

export const SummaryCards: React.FC = () => {
  const { data, isLoading } = useGetSummary();

  const params = useSearchParams();
  const to = params.get("to") || undefined;
  const from = params.get("from") || undefined;

  const dateRangeLabel = formatDateRange({ to, from });

  return (
    <DataGrid>
      <SummaryCard
        title='Remaining'
        value={data?.remainingAmount}
        percentageChange={data?.remainingChange}
        Icon={FaPiggyBank}
        dateRangeLabel={dateRangeLabel}
        isLoading={isLoading}
      />
      <SummaryCard
        title='Income'
        value={data?.incomeAmount}
        percentageChange={data?.incomeChange}
        Icon={FaArrowTrendUp}
        dateRangeLabel={dateRangeLabel}
        isLoading={isLoading}
      />
      <SummaryCard
        title='Expenses'
        value={data?.expensesAmount}
        percentageChange={data?.expensesChange}
        Icon={FaArrowTrendDown}
        dateRangeLabel={dateRangeLabel}
        isLoading={isLoading}
      />
    </DataGrid>
  )
};