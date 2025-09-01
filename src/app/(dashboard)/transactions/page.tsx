'use client';

import { Card, CardContent } from '@/shared/ui/card';

import { TransactionsPageHeader } from './components/categories-header';
import { CSVTransactionsTable, TransactionsTable } from '@/widgets/transactions-table';
import { memo, useState } from 'react';
import { TxShape } from '@/features/csv-import-button';
import { useCSVTransactionsStore } from '@/entities/transactions';

export enum TABLE_STATE {
  VIEW = 'view',
  CSV_IMPORT = 'csv_import',
}

const TransactionsPage: React.FC = () => {
  const [tableState, setTableState] = useState(TABLE_STATE.VIEW);
  const { data } = useCSVTransactionsStore();

  return (
    <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
      <Card className="border-none drop-shadow-sm w-full h-fit">
        <TransactionsPageHeader
          setTableState={setTableState}
          tableState={tableState}
        />
        <CardContent>
          {tableState === TABLE_STATE.VIEW && <TransactionsTable />}
          {tableState === TABLE_STATE.CSV_IMPORT && <CSVTransactionsTable dataShape={data} />}
        </CardContent>
      </Card>
    </div>
  );
};

export default memo(TransactionsPage);