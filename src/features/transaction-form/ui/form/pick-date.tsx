import { useContext } from 'react';
import { useFormContext } from 'react-hook-form';

import { FormField, FormItem, FormLabel, FormControl } from '@/shared/ui/form';
import { DatePicker } from '@/shared/components/date-picker';

import { TransactionFormContext } from './transaction-form';
import { TransactionApiFormSchema } from '../../model/types';

export const PickDate:React.FC = () => {
  const { disabled } = useContext(TransactionFormContext);
  const form = useFormContext<TransactionApiFormSchema>();

  return (
    <FormField
      name='date'
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Category</FormLabel>
          <FormControl>
            <DatePicker
              value={field.value as Date}
              onChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};