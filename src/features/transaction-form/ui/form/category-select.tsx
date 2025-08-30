import { useContext } from 'react';
import { useFormContext } from 'react-hook-form';

import { Select } from '@/shared/components/select';

import { TransactionApiFormSchema } from '../../model/types';
import { FormControl, FormField, FormItem, FormLabel } from '@/shared/ui/form';
import { TransactionFormContext } from './transaction-form';

export const CategorySelect: React.FC = () => {
  const form = useFormContext<TransactionApiFormSchema>();
  const { categoryOptions, onCreateCategory, disabled } = useContext(TransactionFormContext);

  return (
    <FormField
      name='categoryId'
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Category</FormLabel>
          <FormControl>
            <Select
              placeholder="Select an category"
              options={categoryOptions}
              onChange={field.onChange}
              onCreate={onCreateCategory}
              value={field.value}
              disabled={disabled}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};