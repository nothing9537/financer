import { AccountForm, AccountFormSchemaType } from '@/features/account-form';
import { useCreateAccount } from '@/entities/accounts';
import { useSheet } from '@/shared/lib/hooks/use-sheet';

import { AccountSheet } from './account-sheet';

export const NewAccountSheet: React.FC = () => {
  const mutation = useCreateAccount();
  const sheet = useSheet<'new-account'>();

  const handleSubmit = (data: AccountFormSchemaType) => {
    mutation.mutate(data, {
      onSuccess: () => {
        sheet.onClose();
      },
    });
  };

  return (
    <AccountSheet type='new-account' title='New Account' description='Create a new account to track your transactions.'>
      <AccountForm
        onSubmit={handleSubmit}
        disabled={mutation.isPending}
        defaultValues={{ name: '' }}
      />
    </AccountSheet>
  )
}