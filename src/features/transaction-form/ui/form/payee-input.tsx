import { useContext } from 'react';
import { useFormContext } from 'react-hook-form';

import { FormControl, FormField, FormItem, FormLabel } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';

import { TransactionFormSchemaType } from '../../model/types';
import { TransactionFormContext } from './transaction-form';

export const PayeeInput: React.FC = () => {
  const form = useFormContext<TransactionFormSchemaType>();
  const { disabled } = useContext(TransactionFormContext);

  return (
    <FormField
      name='payee'
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Payee</FormLabel>
          <FormControl>
            <Input
              placeholder='Enter transaction source'
              disabled={disabled}
              {...field}
              value={field.value || ''}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};