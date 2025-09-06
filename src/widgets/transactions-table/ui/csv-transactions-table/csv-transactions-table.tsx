'use client';

import { useCSVTransactionsStore } from '@/entities/transactions';
import { DataTable } from '@/shared/components/data-table';
import { TxShape } from '@/features/csv-import-button';

import { columns } from '../../lib/consts/csv-columns';
import { ApplyAccountButton } from './apply-account-button';

type CSVTableProps = {
  dataShape: TxShape[];
};

export const CSVTransactionsTable: React.FC<CSVTableProps> = ({ dataShape }) => {
  const { bulkRemove } = useCSVTransactionsStore();

  return (
    <DataTable
      columns={columns}
      data={dataShape}
      onDelete={(r) => bulkRemove(r.map((row) => row.original.id))}
      extraSelectionRenderActions={<ApplyAccountButton />}
      filter={{
        key: 'payee',
        placeholder: 'Filter transaction by payee...'
      }}
    />
  );
};