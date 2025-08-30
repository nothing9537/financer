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

  if (!sheet.data) {
    return null;
  }

  if (!sheet.data?.accountId) {
    return null;
  }

  const { accountId, amount, categoryId, date, notes, payee, id } = sheet.data;

  return (
    <>
      <ConfirmDialog />
      <TransactionSheet type='edit-transaction' title='Edit Transaction' description='Edit an existing transaction on your record'>
        <TransactionForm
          id={id}
          onSubmit={handleSubmit}
          onCreateAccount={onCreateAccount}
          onCreateCategory={onCreateCategory}
          disabled={isPending}
          accountOptions={accountOptions}
          categoryOptions={categoryOptions}
          defaultValues={{ accountId, amount: amount.toString(), categoryId, date, notes, payee }}
          onDelete={handleDelete}
        />
      </TransactionSheet>
    </>
  );
};