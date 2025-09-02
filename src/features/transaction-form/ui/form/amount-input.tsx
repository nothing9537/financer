import { useContext } from 'react';
import { useFormContext } from 'react-hook-form';

import { AmountInput as CurrencyAmountInput } from '@/shared/components/amount-input';
import { FormControl, FormField, FormItem, FormLabel } from '@/shared/ui/form';

import { TransactionApiFormSchema } from '../../model/types';
import { TransactionFormContext } from './transaction-form';

export const AmountInput: React.FC = () => {
  const form = useFormContext<TransactionApiFormSchema>();
  const { disabled } = useContext(TransactionFormContext);

  return (
    <FormField
      name='amount'
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Amount</FormLabel>
          <FormControl>
            <CurrencyAmountInput
              {...field}
              value={field.value?.toString() ?? ''}
              disabled={disabled}
              placeholder='Enter transaction amount'
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};