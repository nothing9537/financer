import z from 'zod';

import { resolverFormSchema, transactionFormSchema } from '../../lib/consts/form';
import { SelectOption } from '@/shared/types/select-option';

export type TransactionFormSchemaType = z.input<typeof resolverFormSchema>;
export type TransactionApiFormSchema = z.input<typeof transactionFormSchema>;

export interface TransactionFormProps {
  id?: string;
  onSubmit: (data: TransactionApiFormSchema) => void;
  defaultValues?: TransactionFormSchemaType;
  onDelete?: () => void;
  disabled?: boolean;
  accountOptions: SelectOption<string>[];
  categoryOptions: SelectOption<string>[];
  onCreateAccount: (name: string) => void;
  onCreateCategory: (name: string) => void;
}