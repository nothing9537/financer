'use client';

import { useBulkDeleteTransactions, useGetTransactions } from '@/entities/transactions';
import { DataTable } from '@/shared/components/data-table';

import { columns } from '../../lib/consts/columns';

export const TransactionsTable = () => {
  const transactionsQuery = useGetTransactions();
  const bulkTransactionsDelete = useBulkDeleteTransactions();

  const isDisabled = bulkTransactionsDelete.isPending || transactionsQuery.isLoading;

  const data = transactionsQuery.data || [];

  return (
    <DataTable
      data={data}
      columns={columns}
      isLoading={transactionsQuery.isLoading}
      disabled={isDisabled}
      onDelete={(r) => {
        bulkTransactionsDelete.mutate({ ids: r.map((row) => row.original.id) });
      }}
      filter={{
        key: 'payee',
        placeholder: 'Filter transaction by payee...'
      }}
    />
  );
};