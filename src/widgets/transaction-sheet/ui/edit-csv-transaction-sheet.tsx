'use client';

import { TransactionForm } from '@/features/transaction-form';

import { useCSVTransactionSheet } from '../lib/hooks/use-csv-transaction-sheet';
import { TransactionSheet } from './transaction-sheet';

export const EditCSVTransactionSheet: React.FC = () => {
  const { sheet, handleDelete, handleSubmit, ConfirmDialog } = useCSVTransactionSheet();

  return (
    <>
      <ConfirmDialog />
      <TransactionSheet type='edit-csv-transaction' title='Edit Transaction' description='Edit an imported transaction from CSV'>
        {sheet.data?.amount && (
          <TransactionForm
            id={sheet.data.id}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            defaultValues={{ ...sheet.data, amount: sheet.data.amount.toString() }}
          />
        )}
      </TransactionSheet>
    </>
  );
};