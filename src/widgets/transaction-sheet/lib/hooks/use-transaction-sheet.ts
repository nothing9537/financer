import { useCallback } from 'react';

import { useCreateAccount, useGetAccounts } from '@/entities/accounts';
import { useCreateCategory, useGetCategories } from '@/entities/categories';
import { useCreateTransaction, useDeleteTransaction, useEditTransaction } from '@/entities/transactions';
import { TransactionApiFormSchema } from '@/features/transaction-form';
import { SheetStateFor, SheetType } from '@/shared/lib/hooks/use-sheet';
import { useConfirm } from '@/shared/lib/hooks/use-confirm';

export function useTransactionSheet<TType extends SheetType>(type: 'create' | 'edit', sheet: SheetStateFor<TType>, transactionId?: string) {

  const [ConfirmDialog, confirm] = useConfirm({
    title: 'Are you sure?',
    description: 'You are about to delete this transaction'
  });

  const editMutation = useEditTransaction(transactionId);
  const createMutation = useCreateTransaction();
  const deleteMutation = useDeleteTransaction(transactionId);

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
    if (type === 'create') {
      createMutation.mutate(data, {
        onSuccess: () => {
          sheet.onClose();
        },
      });
    } else {
      editMutation.mutate(data, {
        onSuccess: () => {
          sheet.onClose();
        },
      });
    }
  };

  const handleDelete = async () => {
    const ok = await confirm();

    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          sheet.onClose();
        }
      });
    }
  };

  const isPending = editMutation.isPending
    || createMutation.isPending
    || categoryMutation.isPending
    || accountMutation.isPending;

  return {
    onCreateAccount,
    onCreateCategory,
    handleSubmit,
    ConfirmDialog,
    handleDelete,
    categoryOptions,
    accountOptions,
    sheet,
    isPending,
  } as const;
};