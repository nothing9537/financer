import z from 'zod';
import { Hono } from 'hono';
import { v4 as uuidv4 } from 'uuid';
import { zValidator } from '@hono/zod-validator'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { and, desc, eq, gte, inArray, lte, sql } from 'drizzle-orm';
import { parse, subDays } from 'date-fns';
import * as _ from 'lodash';

import { accounts, categories, transactions } from '@/schemas';
import { insertTransactionSchema } from '@/schemas/transactions';
import { db } from '@/db';

const queryValidator = zValidator("query", z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  accountId: z.string().optional(),
}));

const idParamValidator = zValidator("param", z.object({ id: z.string().optional() }));
const transactionJsonValidator = zValidator("json", insertTransactionSchema.omit({ id: true }));
const bulkDeleteValidator = zValidator("json", z.object({ ids: z.array(z.string()) }));
const editTransactionValidator = [idParamValidator, transactionJsonValidator] as const;

const selectObject = {
  id: transactions.id,
  date: transactions.date,
  category: categories.name,
  categoryId: transactions.categoryId,
  payee: transactions.payee,
  amount: transactions.amount,
  notes: transactions.notes,
  account: accounts.name,
  accountId: transactions.accountId,
};

const app = new Hono()
  .get("/", queryValidator, clerkMiddleware(), async (ctx) => {
    const auth = getAuth(ctx);
    const { from, to, accountId } = ctx.req.valid("query");

    if (!auth?.isAuthenticated) {
      return ctx.json({ message: 'Unauthorized' }, 401);
    }

    const defaultTo = new Date();
    const defaultFrom = subDays(defaultTo, 30);
    const startDate = from ? parse(from, "yyyy-MM-dd", new Date()) : defaultFrom;
    const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

    const data = await db
      .select(selectObject)
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(
        and(
          accountId ? eq(transactions.accountId, accountId) : undefined,
          eq(accounts.userId, auth.userId),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate),
        ),
      )
      .orderBy(desc(transactions.date));

    return ctx.json({ transactions: data }, 200);
  })
  .get("/:id", clerkMiddleware(), idParamValidator, async (ctx) => {
    const auth = getAuth(ctx);
    const { id } = ctx.req.valid('param');

    if (!id) {
      return ctx.json({ message: 'Bad Request' }, 400);
    }

    if (!auth?.isAuthenticated) {
      return ctx.json({ message: 'Unauthorized' }, 401);
    }

    const [data] = await db
      .select(_.omit(selectObject, 'category'))
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(
        and(
          eq(transactions.id, id),
          eq(accounts.userId, auth.userId),
        )
      );

    if (!data) {
      return ctx.json({ message: "Not Found" }, 404);
    }

    return ctx.json({ transaction: data }, 200);
  })
  .post("/", clerkMiddleware(), transactionJsonValidator, async (ctx) => {
    const auth = getAuth(ctx);
    const values = ctx.req.valid("json");

    if (!auth?.isAuthenticated) {
      return ctx.json({ message: 'Unauthorized' }, 401);
    }

    const [data] = await db.insert(transactions).values({
      id: uuidv4(),
      ...values
    }).returning();

    return ctx.json({ payload: data }, 201);
  })
  .post("/bulk-delete", clerkMiddleware(), bulkDeleteValidator, async (ctx) => {
    const auth = getAuth(ctx);
    const values = ctx.req.valid("json");

    if (!auth?.isAuthenticated) {
      return ctx.json({ message: 'Unauthorized' }, 401);
    }

    const transactionsToDelete = db.$with("transactions_to_delete").as(
      db
        .select({ id: transactions.id })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(
          and(
            inArray(transactions.id, values.ids),
            eq(accounts.id, auth.userId),
          ),
        )
    );

    const data = await db
      .with(transactionsToDelete)
      .delete(transactions)
      .where(
        inArray(transactions.id, sql`(select id from ${transactionsToDelete})`),
      )
      .returning({ id: transactions.id });

    return ctx.json({ data }, 200);
  })
  .patch('/:id', clerkMiddleware(), ...editTransactionValidator, async (ctx) => {
    const auth = getAuth(ctx);
    const { id } = ctx.req.valid('param');
    const values = ctx.req.valid('json');

    if (!id) {
      return ctx.json({ message: 'Bad Request' }, 400);
    }

    if (!auth?.isAuthenticated) {
      return ctx.json({ message: 'Unauthorized' }, 401);
    }

    const transactionsToUpdate = db.$with("transactions_to_update").as(
      db
        .select({ id: transactions.id })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(
          and(
            eq(transactions.id, id),
            eq(accounts.id, auth.userId),
          ),
        )
    );

    const [data] = await db
      .with(transactionsToUpdate)
      .update(transactions)
      .set(values)
      .where(
        inArray(transactions.id, sql`(select id from ${transactionsToUpdate})`),
      )
      .returning();

    if (!data) {
      return ctx.json({ message: 'Not found' }, 404);
    }

    return ctx.json({ transaction: data }, 200);
  })
  .delete('/:id', clerkMiddleware(), idParamValidator, async (ctx) => {
    const auth = getAuth(ctx);
    const { id } = ctx.req.valid('param');

    if (!id) {
      return ctx.json({ message: 'Bad Request' }, 400);
    }

    if (!auth?.isAuthenticated) {
      return ctx.json({ message: 'Unauthorized' }, 401);
    }

    const transactionsToDelete = db.$with("transactions_to_delete").as(
      db
        .select({ id: transactions.id })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(
          and(
            eq(transactions.id, id),
            eq(accounts.id, auth.userId),
          ),
        )
    );

    const [data] = await db
      .with(transactionsToDelete)
      .delete(transactions)
      .where(
        inArray(transactions.id, sql`(select id from ${transactionsToDelete})`),
      )
      .returning({ id: transactions.id });

    if (!data) {
      return ctx.json({ message: 'Not found' }, 404);
    }

    return ctx.json({ category: data }, 200);
  });

export default app;