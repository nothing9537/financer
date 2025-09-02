'use client';

import { TransactionForm } from '@/features/transaction-form';

import { useSheet } from '@/shared/lib/hooks/use-sheet';

import { useTransactionSheet } from '../lib/hooks/use-transaction-sheet';
import { TransactionSheet } from './transaction-sheet';

export const EditTransactionSheet: React.FC = () => {
  const sheet = useSheet<'edit-transaction'>();

  const { handleSubmit, ConfirmDialog, handleDelete, isPending } = useTransactionSheet<'edit-transaction'>('edit', sheet, sheet.data?.id);

  return (
    <>
      <ConfirmDialog />
      <TransactionSheet type='edit-transaction' title='Edit Transaction' description='Edit an existing transaction on your record'>
        {sheet.data?.amount && (
          <TransactionForm
            id={sheet.data.id}
            onSubmit={handleSubmit}
            disabled={isPending}
            defaultValues={{ ...sheet.data, amount: sheet.data.amount.toString() }}
            onDelete={handleDelete}
          />
        )}
      </TransactionSheet>
    </>
  );
};