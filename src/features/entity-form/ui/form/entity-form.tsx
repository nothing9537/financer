import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Trash } from 'lucide-react';

import { Form, FormControl, FormField, FormItem, FormLabel } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';

import { EntityFormProps, EntitySchema } from '../../model/types';

export const EntityForm = ({ id, defaultValues, onSubmit, onDelete, disabled, placeholder, entity, schema }: EntityFormProps) => {
  const defaultPlaceholder = entity === 'Account' ? 'e.g. My Savings, Cash, Bank' : 'e.g. Grocery, Restaurants, Digital';

  const form = useForm<EntitySchema>({
    resolver: zodResolver(schema.pick({ name: true })),
    defaultValues,
  });


  const buttonContent = disabled ? <Loader2 className='size-4 animate-spin' /> : (id ? 'Save Changes' : `Create ${entity}`);

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
                  placeholder={placeholder || defaultPlaceholder}
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
          <Button className='w-full' disabled={disabled} type='button' variant="outline" onClick={onDelete}>
            <Trash className='size-4 mr-2' />
            Delete {entity}
          </Button>
        )}
      </form>
    </Form>
  );
};