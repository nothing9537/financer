import { useGetAccounts } from '@/entities/accounts';
import { useGetCategories } from '@/entities/categories';
import { useCSVTransactionsStore } from '@/entities/transactions';
import { TransactionApiFormSchema } from '@/features/transaction-form';
import { useConfirm } from '@/shared/lib/hooks/use-confirm';
import { useSheet } from '@/shared/lib/hooks/use-sheet';
import { convertAmountFromMilliunits } from '@/shared/lib/utils/math';

export const useCSVTransactionSheet = () => {
  const [ConfirmDialog, confirm] = useConfirm({
    title: 'Are you sure?',
    description: 'You are about to delete this transaction'
  });

  const sheet = useSheet<'edit-csv-transaction'>();

  const { updateSingle, removeSingle } = useCSVTransactionsStore();
  const accountsQuery = useGetAccounts();
  const categoriesQuery = useGetCategories();

  const handleDelete = async () => {
    const ok = await confirm();

    if (ok && sheet.data?.id) {
      removeSingle(sheet.data.id);
      sheet.onClose();
    }
  };

  const handleSubmit = (data: TransactionApiFormSchema) => {
    const category = categoriesQuery.data?.find((c) => c.id === data.categoryId);
    const account = accountsQuery.data?.find((a) => a.id === data.accountId);

    if (!sheet.data) return;

    updateSingle({
      ...data,
      id: sheet.data.id,
      date: data.date as string,
      amount: convertAmountFromMilliunits(data.amount),
      category: category?.name,
      account: account!.name,
      accountId: data.accountId,
    });

    sheet.onClose();
  }

  return {
    sheet,
    handleSubmit,
    ConfirmDialog,
    handleDelete,
  } as const;
};