'use client';

import { DataTable } from '@/shared/components/data-table';
import { useBulkDeleteAccounts, useGetAccounts } from '@/entities/accounts';
import { useBulkDeleteCategories, useGetCategories } from '@/entities/categories';

import { accountsColumns, categoriesColumns } from '../../lib/consts/columns';
import { useMountedState } from 'react-use';

interface EntityTableProps {
  entity: 'account' | 'category';
}

export const EntityTable: React.FC<EntityTableProps> = ({ entity }) => {
  const mounted = useMountedState();

  const query = entity === 'account' ? useGetAccounts : useGetCategories;
  const bulkDelete = entity === 'account' ? useBulkDeleteAccounts : useBulkDeleteCategories;
  const columns = entity === 'account' ? accountsColumns : categoriesColumns;

  const entityQuery = query();
  const deleteEntityMutation = bulkDelete();

  const entityData = entityQuery.data || [];
  const disabled = entityQuery.isLoading || deleteEntityMutation.isPending;

  if (!mounted) {
    return null;
  }

  return (
    <DataTable
      columns={columns}
      data={entityData}
      isLoading={entityQuery.isLoading}
      disabled={disabled}
      onDelete={(r) => {
        deleteEntityMutation.mutate({ ids: r.map((row) => row.original.id) });
      }}
      filter={{
        key: 'name',
        placeholder: entity === 'account' ? 'Filter accounts by name...' : 'Filter categories by name...'
      }}
    />
  );
};