import { useContext } from 'react';
import { useFormContext } from 'react-hook-form';

import { CategorySelect as EntityCategorySelect } from '@/entities/categories';

import { TransactionApiFormSchema } from '../../model/types';
import { FormControl, FormField, FormItem, FormLabel } from '@/shared/ui/form';
import { TransactionFormContext } from './transaction-form';

export const CategorySelect: React.FC = () => {
  const form = useFormContext<TransactionApiFormSchema>();
  const { disabled } = useContext(TransactionFormContext);

  return (
    <FormField
      name='categoryId'
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Category</FormLabel>
          <FormControl>
            <EntityCategorySelect
              disabled={disabled}
              onChange={field.onChange}
              value={field.value || ''}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};