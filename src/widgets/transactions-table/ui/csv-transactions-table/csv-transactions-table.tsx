'use client';

import { TxShape } from '@/features/csv-import-button';
import { DataTable } from '@/shared/components/data-table';
import { useCSVTransactionsStore } from '@/entities/transactions';

import { columns } from '../../lib/consts/csv-columns';

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
      filter={{
        key: 'payee',
        placeholder: 'Filter transaction by payee...'
      }}
    />
  );
};