import { createInsertSchema } from 'drizzle-zod';
import { pgTable, text } from 'drizzle-orm/pg-core';

export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
  plaid_id: text("plaid_id"),
});

export const insertCategorySchema = createInsertSchema(categories);