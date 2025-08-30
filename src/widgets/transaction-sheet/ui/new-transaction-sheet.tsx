'use client';

import { TransactionForm } from '@/features/transaction-form';

import { useNewTransactionSheet } from '../lib/hooks/use-new-transaction-sheet';
import { TransactionSheet } from './transaction-sheet';

export const NewTransactionSheet: React.FC = () => {
  const { handleSubmit, accountOptions, categoryOptions, onCreateAccount, onCreateCategory, isPending } = useNewTransactionSheet();

  return (
    <TransactionSheet type='new-transaction' title='New Transaction' description='Add a new transaction to your record'>
      <TransactionForm
        onSubmit={handleSubmit}
        onCreateAccount={onCreateAccount}
        onCreateCategory={onCreateCategory}
        disabled={isPending}
        accountOptions={accountOptions}
        categoryOptions={categoryOptions}
      />
    </TransactionSheet>
  );
};