import { pgTable, text } from 'drizzle-orm/pg-core';

export const connectedBanks = pgTable('connected_banks', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  accessToken: text('access_token').notNull().unique(),
  cursor: text('cursor'),
  itemId: text('item_id').notNull().unique(),
});