'use client';

import { InfoIcon } from 'lucide-react';

import { TxShape } from '@/features/csv-import-button';
import { useCSVTransactionsStore } from '@/entities/transactions';
import { DataTable } from '@/shared/components/data-table';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';

import { columns } from '../../lib/consts/csv-columns';
import { ApplyAccountButton } from './apply-account-button';


type CSVTableProps = {
  dataShape: TxShape[];
};

export const CSVTransactionsTable: React.FC<CSVTableProps> = ({ dataShape }) => {
  const { bulkRemove } = useCSVTransactionsStore();

  return (
    <>
      <Alert className="mb-4 bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Quick review recommended</AlertTitle>
        <AlertDescription>
          Before importing, please double-check the <span className="font-medium">Category</span> column.
          We auto-assign categories using heuristics + vector matching — it works well, but it’s not super precise.
          If something looks off, adjust it now; your edits will be used when importing.
        </AlertDescription>
      </Alert>

      <DataTable
        columns={columns}
        data={dataShape}
        onDelete={(r) => bulkRemove(r.map((row) => row.original.id))}
        extraSelectionRenderActions={<ApplyAccountButton />}
        filter={{
          key: 'payee',
          placeholder: 'Filter transaction by payee...',
        }}
      />
    </>
  );
};
