import { relations } from 'drizzle-orm';

import { accounts, insertAccountsSchema } from './accounts';
import { categories, insertCategorySchema } from './categories';
import { transactions } from './transactions';

export { accounts } from './accounts';
export { categories } from './categories';
export { transactions } from './transactions';
export { subscriptions } from './subscriptions';
export { connectedBanks } from './connected-banks';

export const accountRelations = relations(accounts, ({ many }) => ({
  transactions: many(transactions),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  transactions: many(transactions),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  account: one(accounts, {
    fields: [transactions.accountId],
    references: [accounts.id],
  }),
  categories: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}));

export type entitySchema = typeof insertAccountsSchema | typeof insertCategorySchema;