import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { accounts } from './accounts';
import { categories } from './categories';
import { createInsertSchema } from 'drizzle-zod';
import z from 'zod';

export const transactions = pgTable('transactions', {
  id: text('id').primaryKey(),
  amount: integer('amount').notNull(),
  payee: text('payee').notNull(),
  notes: text('notes'),
  date: timestamp("date", { mode: 'date' }).notNull(),
  accountId: text('account_id').references(() => accounts.id, { onDelete: 'cascade' }).notNull(),
  categoryId: text('category_id').references(() => categories.id, { onDelete: 'set null' }),
});

export const insertTransactionSchema = createInsertSchema(transactions, {
  date: z.coerce.date(),
});