import { EntityForm } from '@/features/entity-form';
import { insertCategorySchema } from '@/schemas/categories';

import { useEditEntitySheet } from '../lib/hooks/use-edit-entity-sheet';
import { EntitySheet } from './entity-sheet';

export const EditCategorySheet: React.FC = () => {
  const { ConfirmDialog, sheet, isPending, handleSubmit, handleDelete } = useEditEntitySheet('category');

  return (
    <>
      <ConfirmDialog />
      <EntitySheet type='edit-category' title='Edit Category' description='Edit and existing category'>
        <EntityForm
          id={sheet.data?.id}
          disabled={isPending}
          defaultValues={{ name: sheet?.data?.name || '' }}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          entity='Category'
          schema={insertCategorySchema}
        />
      </EntitySheet>
    </>
  );
};