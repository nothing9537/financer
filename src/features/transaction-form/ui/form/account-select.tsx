import { useContext } from 'react';
import { useFormContext } from 'react-hook-form';

import { AccountSelect as EntityAccountSelect } from '@/entities/accounts';

import { TransactionApiFormSchema } from '../../model/types';
import { FormControl, FormField, FormItem, FormLabel } from '@/shared/ui/form';
import { TransactionFormContext } from './transaction-form';

export const AccountSelect: React.FC = () => {
  const form = useFormContext<TransactionApiFormSchema>();
  const { disabled } = useContext(TransactionFormContext);

  return (
    <FormField
      name='accountId'
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Account</FormLabel>
          <FormControl>
            <EntityAccountSelect
              onChange={field.onChange}
              value={field.value}
              disabled={disabled}
            />
          </FormControl>
        </FormItem>
      )}
    />
  )
}