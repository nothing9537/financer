import { useContext } from 'react';
import { useFormContext } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel } from '@/shared/ui/form';
import { Textarea } from '@/shared/ui/textarea';

import { TransactionFormSchemaType } from '../../model/types';
import { TransactionFormContext } from './transaction-form';

export const NotesTextarea: React.FC = () => {
  const form = useFormContext<TransactionFormSchemaType>();
  const { disabled } = useContext(TransactionFormContext);

  return (
    <FormField
      name='notes'
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Notes</FormLabel>
          <FormControl>
            <Textarea
              {...field}
              value={field.value ?? ''}
              disabled={disabled}
              placeholder='Enter transaction notes or leave it empty.'
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};