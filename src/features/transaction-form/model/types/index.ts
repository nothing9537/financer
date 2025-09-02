import z from 'zod';

import { resolverFormSchema, transactionFormSchema } from '../../lib/consts/form';

export type TransactionFormSchemaType = z.input<typeof resolverFormSchema>;
export type TransactionApiFormSchema = z.input<typeof transactionFormSchema>;

export interface TransactionFormProps {
  id?: string;
  onSubmit: (data: TransactionApiFormSchema) => void;
  onDelete?: () => void;
  defaultValues?: TransactionFormSchemaType;
  disabled?: boolean;
}