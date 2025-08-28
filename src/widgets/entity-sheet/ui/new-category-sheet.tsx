import { EntityForm, EntitySchema } from '@/features/entity-form';
import { useSheet } from '@/shared/lib/hooks/use-sheet';
import { useCreateCategory } from '@/entities/categories';
import { insertCategorySchema } from '@/schemas/categories';

import { EntitySheet } from './entity-sheet';

export const NewCategorySheet: React.FC = () => {
  const mutation = useCreateCategory();
  const sheet = useSheet<'new-category'>();

  const handleSubmit = (data: EntitySchema) => {
    mutation.mutate(data, {
      onSuccess: () => {
        sheet.onClose();
      },
    });
  };

  return (
    <EntitySheet type='new-category' title='New Category' description='Create a new category to group your transactions.'>
      <EntityForm
        onSubmit={handleSubmit}
        disabled={mutation.isPending}
        defaultValues={{ name: '' }}
        entity='Category'
        schema={insertCategorySchema}
      />
    </EntitySheet>
  )
}