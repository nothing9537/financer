'use client';

import { TransactionForm } from '@/features/transaction-form';

import { useTransactionSheet } from '../lib/hooks/use-transaction-sheet';
import { TransactionSheet } from './transaction-sheet';
import { useSheet } from '@/shared/lib/hooks/use-sheet';

export const NewTransactionSheet: React.FC = () => {
  const sheet = useSheet<'new-transaction'>();
  const { handleSubmit, isPending } = useTransactionSheet<'new-transaction'>('create', sheet);

  return (
    <TransactionSheet type='new-transaction' title='New Transaction' description='Add a new transaction to your record'>
      <TransactionForm
        onSubmit={handleSubmit}
        disabled={isPending}
      />
    </TransactionSheet>
  );
};