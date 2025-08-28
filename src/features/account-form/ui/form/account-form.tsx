import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Trash } from 'lucide-react';

import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/shared/ui/form';

import { AccountFormProps, AccountFormSchemaType } from '../../model/types';
import { accountFormSchema } from '../../lib/consts/account-form-schema';

export const AccountForm: React.FC<AccountFormProps> = ({ id, defaultValues, onSubmit, onDelete, disabled, placeholder }) => {
  const form = useForm<AccountFormSchemaType>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });

  const handleDelete = () => {
    onDelete?.();
  };

  const buttonContent = disabled ? <Loader2 className='size-4 animate-spin' /> : (id ? 'Save Changes' : 'Create Account');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 pt-4'>
        <FormField
          name='name'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder={placeholder || 'e.g. My Savings, Cash, Bank'}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className='w-full' disabled={disabled} type='submit'>
          {buttonContent}
        </Button>
        {!!id && (
          <Button className='w-full' disabled={disabled} type='button' variant="outline" onClick={handleDelete}>
            <Trash className='size-4 mr-2' />
            Delete Account
          </Button>
        )}
      </form>
    </Form>
  );
};