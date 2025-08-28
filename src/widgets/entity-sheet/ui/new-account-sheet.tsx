import { useCreateAccount } from '@/entities/accounts';
import { useSheet } from '@/shared/lib/hooks/use-sheet';

import { EntitySheet } from './entity-sheet';
import { EntityForm, EntitySchema } from '@/features/entity-form';
import { insertAccountsSchema } from '@/schemas/accounts';

export const NewAccountSheet: React.FC = () => {
  const mutation = useCreateAccount();
  const sheet = useSheet<'new-account'>();

  const handleSubmit = (data: EntitySchema) => {
    mutation.mutate(data, {
      onSuccess: () => {
        sheet.onClose();
      },
    });
  };

  return (
    <EntitySheet type='new-account' title='New Account' description='Create a new account to track your transactions.'>
      <EntityForm
        onSubmit={handleSubmit}
        disabled={mutation.isPending}
        defaultValues={{ name: '' }}
        entity='Account'
        schema={insertAccountsSchema}
      />
    </EntitySheet>
  )
}