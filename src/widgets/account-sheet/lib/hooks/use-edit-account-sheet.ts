import { AccountFormSchemaType } from '@/features/account-form';
import { useDeleteAccount, useEditAccount } from '@/entities/accounts';
import { useSheet } from '@/shared/lib/hooks/use-sheet';
import { useConfirm } from '@/shared/lib/hooks/use-confirm';

export const useEditAccountSheet = () => {
  const sheet = useSheet<'edit-account'>();
  const editMutation = useEditAccount(sheet.data?.id);
  const deleteMutation = useDeleteAccount(sheet.data?.id);
  const [ConfirmDialog, confirm] = useConfirm({
    title: 'Are you sure?',
    description: `You are about to delete '${sheet.data?.name || 'this'}' account.`
  });

  const isPending = editMutation.isPending || deleteMutation.isPending;

  const handleSubmit = (data: AccountFormSchemaType) => {
    editMutation.mutate(data, {
      onSuccess: () => {
        sheet.onClose();
      },
    });
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

  return {
    ConfirmDialog,
    sheet,
    isPending,
    handleSubmit,
    handleDelete,
  } as const;
};
