import z from 'zod';
import { Hono } from 'hono';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { zValidator } from '@hono/zod-validator';
import { differenceInDays, parse, subDays } from 'date-fns';
import { and, desc, eq, gte, lt, lte, sql } from 'drizzle-orm';

import { calculatePercentageChange } from '@/shared/lib/utils/math';
import { accounts, categories, transactions } from '@/schemas';
import { db } from '@/db';

import { fetchFinancialData } from './utils/fetch-financial-data';
import { fillMissingDays } from './utils/fill-missing-days';

const getQueryValidator = zValidator('query', z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  accountId: z.string().optional(),
}));

const app = new Hono()
  .get("/", clerkMiddleware(), getQueryValidator, async (ctx) => {
    const auth = getAuth(ctx);
    const { from, to, accountId } = ctx.req.valid('query');

    if (!auth?.isAuthenticated) {
      return ctx.json({ message: 'Unauthorized' }, 401);
    }

    const defaultTo = new Date();
    const defaultFrom = subDays(defaultTo, 30);

    const startDate = from ? parse(from, "yyyy-MM-dd", new Date()) : defaultFrom;
    const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

    const periodLength = differenceInDays(endDate, startDate) + 1;
    const lastPeriodStart = subDays(startDate, periodLength);
    const lastPeriodEnd = subDays(endDate, periodLength);

    const [currentPeriod] = await fetchFinancialData(auth.userId, startDate, endDate, accountId);
    const [lastPeriod] = await fetchFinancialData(auth.userId, lastPeriodStart, lastPeriodEnd, accountId);

    const incomeChange = calculatePercentageChange(currentPeriod.income, lastPeriod.income);
    const expensesChange = calculatePercentageChange(currentPeriod.expenses, lastPeriod.expenses);
    const remainingChange = calculatePercentageChange(currentPeriod.remaining, lastPeriod.remaining);

    const category = await db
      .select({
        name: categories.name,
        value: sql`SUM(ABS(${transactions.amount}))`.mapWith(Number),
      })
      .from(transactions)
      .innerJoin(
        accounts,
        eq(
          transactions.accountId,
          accounts.id,
        )
      )
      .innerJoin(
        categories,
        eq(
          transactions.categoryId,
          categories.id,
        )
      )
      .where(
        and(
          accountId ? eq(transactions.accountId, accountId) : undefined,
          eq(accounts.userId, auth.userId),
          lt(transactions.amount, 0),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate),
        ),
      )
      .groupBy(categories.name)
      .orderBy(
        desc(
          sql`SUM(ABS(${transactions.amount}))`,
        ),
      );

    const topCategories = category.slice(0, 3);
    const otherCategories = category.slice(3);
    const otherSum = otherCategories.reduce((acc, curr) => acc + curr.value, 0);

    const finalCategories = topCategories;

    if (otherCategories.length > 3) {
      finalCategories.push({
        name: 'Other',
        value: otherSum,
      })
    }

    const activeDays = await db
      .select({
        date: transactions.date,
        income: sql`SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
        expenses: sql`SUM(CASE WHEN ${transactions.amount} < 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
      })
      .from(transactions)
      .innerJoin(
        accounts,
        eq(
          transactions.accountId,
          accounts.id,
        )
      )
      .where(
        and(
          accountId ? eq(transactions.accountId, accountId) : undefined,
          eq(accounts.userId, auth.userId),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate),
        ),
      )
      .groupBy(transactions.date)
      .orderBy(transactions.date);

    const days = fillMissingDays(activeDays, startDate, endDate);

    return ctx.json({
      data: {
        remainingAmount: currentPeriod.remaining,
        remainingChange,
        incomeAmount: currentPeriod.income,
        incomeChange,
        expensesAmount: currentPeriod.expenses,
        expensesChange,
        categories: finalCategories,
        days,
      }
    })
  });

export default app;