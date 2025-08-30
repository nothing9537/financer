import { useCallback } from 'react';

import { useCreateAccount, useGetAccounts } from '@/entities/accounts';
import { useCreateCategory, useGetCategories } from '@/entities/categories';
import { useCreateTransaction } from '@/entities/transactions';
import { TransactionApiFormSchema } from '@/features/transaction-form';
import { useSheet } from '@/shared/lib/hooks/use-sheet';

export const useNewTransactionSheet = () => {
  const sheet = useSheet<'new-transaction'>();

  const transactionMutation = useCreateTransaction();

  const accountsQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const onCreateAccount = useCallback((name: string) => accountMutation.mutate({ name }), [accountMutation]);
  const accountOptions = (accountsQuery.data || []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const categoriesQuery = useGetCategories();
  const categoryMutation = useCreateCategory();
  const onCreateCategory = useCallback((name: string) => categoryMutation.mutate({ name }), [categoryMutation]);
  const categoryOptions = (categoriesQuery.data || []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const handleSubmit = (data: TransactionApiFormSchema) => {
    transactionMutation.mutate(data, {
      onSuccess: () => {
        sheet.onClose();
      },
    });
  };

  const isPending = transactionMutation.isPending
    || categoryMutation.isPending
    || accountMutation.isPending;

  return {
    onCreateAccount,
    onCreateCategory,
    handleSubmit,
    categoryOptions,
    accountOptions,
    sheet,
    isPending,
  } as const;
};