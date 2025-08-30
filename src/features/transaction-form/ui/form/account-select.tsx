import { useContext } from 'react';
import { useFormContext } from 'react-hook-form';

import { Select } from '@/shared/components/select';

import { TransactionApiFormSchema } from '../../model/types';
import { FormControl, FormField, FormItem, FormLabel } from '@/shared/ui/form';
import { TransactionFormContext } from './transaction-form';

export const AccountSelect: React.FC = () => {
  const form = useFormContext<TransactionApiFormSchema>();
  const { accountOptions, onCreateAccount, disabled } = useContext(TransactionFormContext);

  return (
    <FormField
      name='accountId'
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Select
              placeholder="Select an account"
              options={accountOptions}
              onChange={field.onChange}
              onCreate={onCreateAccount}
              value={field.value}
              disabled={disabled}
            />
          </FormControl>
        </FormItem>
      )}
    />
  )
}