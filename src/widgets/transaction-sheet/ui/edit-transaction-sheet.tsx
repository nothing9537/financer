'use client';

import { TransactionForm } from '@/features/transaction-form';

import { useTransactionSheet } from '../lib/hooks/use-transaction-sheet';
import { TransactionSheet } from './transaction-sheet';
import { useSheet } from '@/shared/lib/hooks/use-sheet';

export const EditTransactionSheet: React.FC = () => {
  const sheet = useSheet<'edit-transaction'>();

  const {
    handleSubmit,
    accountOptions,
    categoryOptions,
    onCreateAccount,
    onCreateCategory,
    isPending,
    ConfirmDialog,
    handleDelete,
  } = useTransactionSheet<'edit-transaction'>('edit', sheet, sheet.data?.id);

  return (
    <>
      <ConfirmDialog />
      <TransactionSheet type='edit-transaction' title='Edit Transaction' description='Edit an existing transaction on your record'>
        {sheet.data?.accountId && (
          <TransactionForm
            id={sheet.data.id}
            onSubmit={handleSubmit}
            onCreateAccount={onCreateAccount}
            onCreateCategory={onCreateCategory}
            disabled={isPending}
            accountOptions={accountOptions}
            categoryOptions={categoryOptions}
            defaultValues={{ ...sheet.data, amount: sheet.data.amount.toString() }}
            onDelete={handleDelete}
          />
        )}
      </TransactionSheet>
    </>
  );
};