/* eslint-disable react/display-name */
'use client';

import { Dispatch, memo, SetStateAction } from 'react';
import { Plus, Trash, Undo } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { CardHeader, CardTitle } from '@/shared/ui/card';
import { useSheet } from '@/shared/lib/hooks/use-sheet';
import { CSVImportButton } from '@/features/csv-import-button';

import { TABLE_STATE } from '../page';
import { useCSVTransactionsStore } from '@/entities/transactions';
import { useConfirm } from '@/shared/lib/hooks/use-confirm';

type TransactionsPageHeaderProps = {
  setTableState: Dispatch<SetStateAction<TABLE_STATE>>;
  tableState: TABLE_STATE;
}

export const TransactionsPageHeader: React.FC<TransactionsPageHeaderProps> = memo(({ setTableState, tableState }) => {
  const { setData, clearData, data } = useCSVTransactionsStore();
  const [ConfirmDialog, confirm] = useConfirm({
    title: 'Are you sure?',
    description: 'This action will clear all imported transactions and changes made to them.'
  });

  const handleClear = async () => {
    if (data.length) {
      const ok = await confirm();

      if (ok) {
        clearData();
        setTableState(TABLE_STATE.VIEW);
      }
    } else {
      setTableState(TABLE_STATE.VIEW);
    }
  };

  const Icon = data.length ? Trash : Undo;

  const sheet = useSheet<'new-transaction'>();

  return (
    <>
      <ConfirmDialog />
      <CardHeader className='gap-y-2 lg:grid-rows-1 lg:grid-cols-2'>
        <CardTitle className='text-xl w-fit line-clamp-1'>
          Transactions history
        </CardTitle>
        <div className='lg:ml-auto flex lg:items-center gap-x-2 flex-col lg:flex-row gap-y-2'>
          {tableState === TABLE_STATE.VIEW && (
            <Button size='sm' onClick={() => sheet.onOpen('new-transaction')}>
              <Plus className='size-4 mr-2' />
              Add new
            </Button>
          )}
          {tableState === TABLE_STATE.CSV_IMPORT && (
            <Button size='sm' onClick={handleClear}>
              <Icon className='size-4 mr-2' />
              {data.length ? 'Clear' : 'Back'}
            </Button>
          )}
          <CSVImportButton
            onImport={setData}
            onPickerOpen={() => setTableState(TABLE_STATE.CSV_IMPORT)}
          />
        </div>
      </CardHeader>
    </>
  );
});