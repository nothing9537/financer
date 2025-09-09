import { createInsertSchema } from 'drizzle-zod';
import { index, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core';

export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
  plaid_id: text("plaid_id"),
}, (t) => ([
  index('categories_user_idx').on(t.userId),
  uniqueIndex('categories_user_plaid_unique').on(t.userId, t.plaid_id),
]));

export const insertCategorySchema = createInsertSchema(categories);