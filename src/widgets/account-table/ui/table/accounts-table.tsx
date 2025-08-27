'use client';

import { DataTable } from '@/shared/components/data-table/data-table';
import { useBulkDeleteAccounts, useGetAccounts } from '@/entities/accounts';

import { columns } from '../../lib/consts/columns';

export const AccountsTable: React.FC = () => {
  const accountsQuery = useGetAccounts();
  const deleteAccountsMutation = useBulkDeleteAccounts();

  const accounts = accountsQuery.data || [];
  const disabled = accountsQuery.isLoading || deleteAccountsMutation.isPending;

  return (
    <DataTable
      columns={columns}
      data={accounts}
      isLoading={accountsQuery.isLoading}
      disabled={disabled}
      onDelete={(r) => {
        deleteAccountsMutation.mutate({ ids: r.map((row) => row.original.id) });
      }}
    />
  );
};