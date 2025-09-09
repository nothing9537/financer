import { pgTable, text } from 'drizzle-orm/pg-core';

export const subscriptions = pgTable('subscriptions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().unique(),
  subscriptionId: text('subscription_id').notNull().unique(),
  status: text('status').notNull(),
});