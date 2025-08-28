import { EntityForm } from '@/features/entity-form';

import { insertAccountsSchema } from '@/schemas/accounts';
import { useEditEntitySheet } from '../lib/hooks/use-edit-entity-sheet';
import { EntitySheet } from './entity-sheet';

export const EditAccountSheet: React.FC = () => {
  const { ConfirmDialog, sheet, isPending, handleSubmit, handleDelete } = useEditEntitySheet('account');

  return (
    <>
      <ConfirmDialog />
      <EntitySheet type='edit-account' title='Edit Account' description='Edit and existing account'>
        <EntityForm
          id={sheet.data?.id}
          disabled={isPending}
          defaultValues={{ name: sheet?.data?.name || '' }}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          entity='Account'
          schema={insertAccountsSchema}
        />
      </EntitySheet>
    </>
  );
};