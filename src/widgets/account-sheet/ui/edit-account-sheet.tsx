import { AccountForm } from '@/features/account-form';

import { AccountSheet } from './account-sheet';
import { useEditAccountSheet } from '../lib/hooks/use-edit-account-sheet';

export const EditAccountSheet: React.FC = () => {
  const { ConfirmDialog, sheet, isPending, handleSubmit, handleDelete } = useEditAccountSheet();

  return (
    <>
      <ConfirmDialog />
      <AccountSheet type='edit-account' title='Edit Account' description='Edit and existing account'>
        <AccountForm
          id={sheet.data?.id}
          disabled={isPending}
          defaultValues={{ name: sheet?.data?.name || '' }}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
        />
      </AccountSheet>
    </>
  );
};