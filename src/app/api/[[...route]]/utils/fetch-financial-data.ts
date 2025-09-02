import { db } from '@/db';
import { accounts, transactions } from '@/schemas';
import { and, eq, gte, lte, sql, sum } from 'drizzle-orm';

export async function fetchFinancialData(userId: string, startDate: Date, endDate: Date, accountId?: string) {
  return await db
    .select({
      income: sql`SUM(SUM CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
      expenses: sql`SUM(SUM CASE WHEN ${transactions.amount} < 0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
      remaining: sum(transactions.amount).mapWith(Number)
    })
    .from(transactions)
    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
    .where(
      and(
        accountId ? eq(transactions.accountId, accountId) : undefined,
        eq(accounts.userId, userId),
        gte(transactions.date, startDate),
        lte(transactions.date, endDate),
      ),
    );
}