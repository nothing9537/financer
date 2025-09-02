import z from 'zod';

import { insertTransactionSchema } from '@/schemas/transactions';

export const transactionFormSchema = insertTransactionSchema.omit({
  id: true
});

export const resolverFormSchema = z.object({
  date: z.coerce.date(),
  accountId: z.string(),
  categoryId: z.string().nullable().optional(),
  payee: z.string(),
  amount: z.string(),
  notes: z.string().nullable().optional(),
});