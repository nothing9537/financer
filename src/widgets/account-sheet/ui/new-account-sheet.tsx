import { AccountForm } from '@/features/account-form';
import { useCreateAccount } from '@/entities/accounts';

import { AccountSheet } from './account-sheet';

export const NewAccountSheet: React.FC = () => {
  const mutation = useCreateAccount();

  return (
    <AccountSheet>
      <AccountForm
        onSubmit={mutation.mutate}
        disabled={mutation.isPending}
        defaultValues={{ name: '' }}
      />
    </AccountSheet>
  )
}