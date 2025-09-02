'use client';

import { Loader2, Trash } from 'lucide-react';
import { createContext } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { convertAmountToMilliunits } from '@/shared/lib/utils/math';
import { Button } from '@/shared/ui/button';
import { Form } from '@/shared/ui/form';

import { TransactionFormProps, TransactionFormSchemaType } from '../../model/types';
import { resolverFormSchema } from '../../lib/consts/form';
import { AccountSelect } from './account-select';
import { CategorySelect } from './category-select';
import { PickDate } from './pick-date';
import { PayeeInput } from './payee-input';
import { AmountInput } from './amount-input';
import { NotesTextarea } from './notes-textarea';

export const TransactionFormContext = createContext<TransactionFormProps>({
  onSubmit: () => { },
});

export const TransactionForm = (props: TransactionFormProps) => {
  const { onSubmit, onDelete, disabled, id, defaultValues } = props;

  const form = useForm<TransactionFormSchemaType>({
    resolver: zodResolver(resolverFormSchema),
    defaultValues,
  });

  const handleSubmit = (data: TransactionFormSchemaType) => {
    const amountInMilliunits = convertAmountToMilliunits(data.amount);

    onSubmit({ ...data, amount: amountInMilliunits });
  };

  const buttonContent = disabled ? <Loader2 className='size-4 animate-spin' /> : id ? 'Edit transaction' : 'Add a transaction';

  return (
    <TransactionFormContext value={props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4 pt-4'>
          <PickDate />
          <AccountSelect />
          <CategorySelect />
          <AmountInput />
          <PayeeInput />
          <NotesTextarea />
          <Button className='w-full' disabled={disabled} type='submit'>
            {buttonContent}
          </Button>
          {!!id && (
            <Button className='w-full' disabled={disabled} type='button' variant="outline" onClick={onDelete}>
              <Trash className='size-4 mr-2' />
              Delete transaction
            </Button>
          )}
        </form>
      </Form>
    </TransactionFormContext>
  );
};