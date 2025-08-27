import { AccountForm, AccountFormSchemaType } from '@/features/account-form';
import { useCreateAccount } from '@/entities/accounts';

import { AccountSheet } from './account-sheet';
import { useSheet } from '@/shared/lib/hooks/use-sheet';

export const NewAccountSheet: React.FC = () => {
  const mutation = useCreateAccount();
  const sheet = useSheet();

  const handleSubmit = (data: AccountFormSchemaType) => {
    mutation.mutate(data, {
      onSuccess: () => {
        sheet.onClose();
      },
    });
  };

  return (
    <AccountSheet>
      <AccountForm
        onSubmit={handleSubmit}
        disabled={mutation.isPending}
        defaultValues={{ name: '' }}
      />
    </AccountSheet>
  )
}