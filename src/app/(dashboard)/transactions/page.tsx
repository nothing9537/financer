'use client';

import { memo, Suspense, useState } from 'react';
import { Card, CardContent } from '@/shared/ui/card';

import { CSVTransactionsTable, TransactionsTable } from '@/widgets/transactions-table';
import { ExportCSVTransactionButton } from '@/features/export-csv-transactions';
import { useCSVTransactionsStore } from '@/entities/transactions';

import { TransactionsPageHeader } from './components/categories-header';

export enum TABLE_STATE {
  VIEW = 'view',
  CSV_IMPORT = 'csv_import',
}

const TransactionsPage: React.FC = () => {
  const [tableState, setTableState] = useState(TABLE_STATE.VIEW);
  const { data, clearData } = useCSVTransactionsStore();

  return (
    <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
      <Card className="border-none drop-shadow-sm w-full h-fit">
        <TransactionsPageHeader
          setTableState={setTableState}
          tableState={tableState}
        />
        <CardContent>
          <Suspense>
            {tableState === TABLE_STATE.VIEW && <TransactionsTable />}
            {tableState === TABLE_STATE.CSV_IMPORT && (
              <>
                <CSVTransactionsTable dataShape={data} />
                <ExportCSVTransactionButton
                  successAction={() => {
                    clearData();
                    setTableState(TABLE_STATE.VIEW);
                  }}
                />
              </>
            )}
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
};

export default memo(TransactionsPage);