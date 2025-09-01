import { useCreateAccount } from '@/entities/accounts';
import { useCreateCategory } from '@/entities/categories';
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

  const accountMutation = useCreateAccount();
  const categoryMutation = useCreateCategory();

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
    handleSubmit,
    ConfirmDialog,
    handleDelete,
    sheet,
    isPending,
  } as const;
};