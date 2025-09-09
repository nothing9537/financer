/* eslint-disable @typescript-eslint/no-explicit-any */
import z from 'zod';
import { Hono } from 'hono';
import { Configuration, CountryCode, PersonalFinanceCategory, PlaidApi, PlaidEnvironments, Products } from 'plaid';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { zValidator } from '@hono/zod-validator';
import { v4 as uuidv4 } from 'uuid';

import { db } from '@/db';
import { accounts, categories, connectedBanks, transactions } from '@/schemas';
import { convertAmountToMilliunits } from '@/shared/lib/utils/math';
import { and, eq, inArray, isNotNull } from 'drizzle-orm';

const config = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_TOKEN!,
      "PLAID-SECRET": process.env.PLAID_SECRET_TOKEN!,
    },
  },
});

const buildPfcCategoryId = (userId: string, detailed: string) =>
  `pfc:${userId}:${detailed}`;

const toMilli = (amount: number) => Math.round(amount * 1000);

const prettifyPfc = (pfc?: PersonalFinanceCategory | null) => {
  if (!pfc?.detailed || !pfc?.primary) return 'Uncategorized';
  const pref = `${pfc.primary}_`;
  const tail = pfc.detailed.startsWith(pref) ? pfc.detailed.slice(pref.length) : pfc.detailed;
  const human = tail
    .replace(/_AND_/g, ' & ')
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (m) => m.toUpperCase());
  return human;
};

const exchangePublicTokenValidator = zValidator('json', z.object({ public_token: z.string(), }))

const client = new PlaidApi(config);

const app = new Hono()
  .get("/connected-bank", clerkMiddleware(), async (ctx) => {
    const auth = getAuth(ctx);

    if (!auth?.isAuthenticated) {
      return ctx.json({ error: "Unauthorized" }, 401);
    }

    const [connectedBank] = await db
      .select()
      .from(connectedBanks)
      .where(
        eq(
          connectedBanks.userId,
          auth.userId,
        ),
      );

    return ctx.json({ data: connectedBank || null });
  },
  )
  .delete("/connected-bank", clerkMiddleware(), async (ctx) => {
    const auth = getAuth(ctx);

    if (!auth?.isAuthenticated) {
      return ctx.json({ error: "Unauthorized" }, 401);
    }

    const [connectedBank] = await db
      .delete(connectedBanks)
      .where(
        eq(
          connectedBanks.userId,
          auth.userId,
        ),
      )
      .returning({
        id: connectedBanks.id,
      });

    if (!connectedBank) {
      return ctx.json({ error: "Not found" }, 404);
    }

    await db
      .delete(accounts)
      .where(
        and(
          eq(accounts.userId, auth.userId),
          isNotNull(accounts.plaid_id),
        ),
      );

    await db
      .delete(categories)
      .where(
        and(
          eq(categories.userId, auth.userId),
          isNotNull(categories.plaid_id),
        ),
      );

    return ctx.json({ data: connectedBank }, 200);
  },
  )
  .post('/create-link-token', clerkMiddleware(), async (ctx) => {
    const auth = getAuth(ctx);

    if (!auth?.isAuthenticated) {
      return ctx.json({ message: 'Unauthorized' }, 401);
    }

    const token = await client.linkTokenCreate({
      user: { client_user_id: auth.userId },
      client_name: 'Financer',
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: 'en',
      transactions: { days_requested: 730 },
      webhook: `${process.env.NEXT_PUBLIC_APP_URL}/api/plaid/webhook`
    });

    return ctx.json({ token: token.data.link_token }, 201);
  })
  .post('/exchange-public-token', clerkMiddleware(), exchangePublicTokenValidator, async (ctx) => {
    const auth = getAuth(ctx);
    if (!auth?.isAuthenticated) {
      return ctx.json({ message: 'Unauthorized' }, 401);
    }

    const { public_token } = ctx.req.valid('json');

    const exchange = await client.itemPublicTokenExchange({ public_token });

    const [connectedBank] = await db
      .insert(connectedBanks)
      .values({
        id: uuidv4(),
        userId: auth.userId,
        accessToken: exchange.data.access_token,
        cursor: null,
        itemId: exchange.data.item_id,
      })
      .returning();

    const plaidAccounts = await client.accountsGet({
      access_token: connectedBank.accessToken,
    });

    const mappedAccounts = plaidAccounts.data.accounts.map((account) => ({
      id: uuidv4(),
      name: account.name,
      plaid_id: account.account_id,
      userId: auth.userId,
    }));

    let newAccounts: { id: string; name: string; plaid_id: string | null; userId: string }[] = [];
    try {
      newAccounts = await db.insert(accounts).values(mappedAccounts).returning();
    } catch {
      const existing = await db
        .select({ id: accounts.id, name: accounts.name, plaid_id: accounts.plaid_id, userId: accounts.userId })
        .from(accounts)
        .where(and(
          eq(accounts.userId, auth.userId),
          inArray(accounts.plaid_id, mappedAccounts.map(a => a.plaid_id))
        ));
      newAccounts = existing;
    }

    let cursor = connectedBank.cursor ?? '';
    const toInsertTx: typeof transactions.$inferInsert[] = [];
    let insertedCategories = 0;

    while (true) {
      const res = await client.transactionsSync({
        access_token: connectedBank.accessToken,
        cursor,
        options: { include_personal_finance_category: true },
      });

      const pfcByCode = new Map<string, PersonalFinanceCategory>();
      for (const t of [...res.data.added, ...res.data.modified]) {
        const pfc = t.personal_finance_category;
        if (pfc?.detailed) pfcByCode.set(pfc.detailed, pfc);
      }

      const catIdByPlaid = new Map<string, string>();

      if (pfcByCode.size) {
        const codes = [...pfcByCode.keys()];

        const existing = await db
          .select({ id: categories.id, plaid_id: categories.plaid_id })
          .from(categories)
          .where(and(
            eq(categories.userId, auth.userId),
            inArray(categories.plaid_id, codes),
          ));

        for (const r of existing) {
          if (r.plaid_id) catIdByPlaid.set(r.plaid_id, r.id);
        }

        const needInsertCodes = codes.filter((code) => !catIdByPlaid.has(code));
        if (needInsertCodes.length) {
          const catRows = needInsertCodes.map((code) => {
            const pfc = pfcByCode.get(code)!;
            return {
              id: code,
              name: prettifyPfc(pfc),
              userId: auth.userId,
              plaid_id: code,
            };
          });

          try {
            const inserted = await db.insert(categories).values(catRows).returning({
              id: categories.id,
              plaid_id: categories.plaid_id,
            });
            insertedCategories += inserted.length;
            for (const r of inserted) {
              if (r.plaid_id) catIdByPlaid.set(r.plaid_id, r.id);
            }
          } catch {
            const backfill = await db
              .select({ id: categories.id, plaid_id: categories.plaid_id })
              .from(categories)
              .where(and(
                eq(categories.userId, auth.userId),
                inArray(categories.plaid_id, needInsertCodes),
              ));
            for (const r of backfill) {
              if (r.plaid_id) catIdByPlaid.set(r.plaid_id, r.id);
            }
          }
        }
      }

      for (const t of res.data.added) {
        const account = newAccounts.find((a) => a.plaid_id === t.account_id);
        if (!account) continue;

        const code = t.personal_finance_category?.detailed ?? null;
        const categoryId =
          code
            ? (catIdByPlaid.get(code) ?? buildPfcCategoryId(auth.userId, code) ?? null)
            : null;

        let safeCategoryId: string | null = categoryId;
        if (categoryId) {
          const [exists] = await db
            .select({ id: categories.id })
            .from(categories)
            .where(and(eq(categories.userId, auth.userId), eq(categories.id, categoryId)));
          if (!exists) safeCategoryId = null;
        }

        toInsertTx.push({
          id: uuidv4(),
          amount: toMilli(t.amount),
          payee: t.merchant_name || t.name,
          date: new Date(t.date),
          accountId: account.id,
          categoryId: safeCategoryId,
        });
      }

      cursor = res.data.next_cursor;
      if (!res.data.has_more) break;
    }

    if (toInsertTx.length) {
      try {
        await db.insert(transactions).values(toInsertTx);
      } catch {
      }
    }

    await db
      .update(connectedBanks)
      .set({ cursor })
      .where(eq(connectedBanks.id, connectedBank.id));

    return ctx.json(
      {
        ok: true,
        inserted: {
          accounts: newAccounts.length,
          categories: insertedCategories,
          transactions: toInsertTx.length,
        },
      },
      201,
    );
  })

  .post('/webhook', async (ctx) => {
    const body = await ctx.req.json<any>().catch(() => ({}));
    const { webhook_type, webhook_code, item_id } = body ?? {};

    if (webhook_type !== 'TRANSACTIONS' || webhook_code !== 'SYNC_UPDATES_AVAILABLE') {
      return ctx.json({ ok: true, ignored: true });
    }

    const [bank] = await db
      .select()
      .from(connectedBanks)
      .where(eq(connectedBanks.itemId, item_id))
      .limit(1);

    if (!bank) {
      return ctx.json({ ok: true, ignored: 'unknown_item' });
    }

    let cursor = bank.cursor ?? '';
    const toInsert: typeof transactions.$inferInsert[] = [];
    let insertedCategories = 0;

    while (true) {
      const res = await client.transactionsSync({
        access_token: bank.accessToken,
        cursor,
        options: { include_personal_finance_category: true },
      });

      const pfcMap = new Map<string, string>();
      for (const t of [...res.data.added, ...res.data.modified]) {
        const pfc = t.personal_finance_category;
        if (pfc?.detailed) {
          const primary = pfc.primary ?? pfc.detailed.split('__')[0];
          if (!pfcMap.has(pfc.detailed)) pfcMap.set(pfc.detailed, primary);
        }
      }

      if (pfcMap.size) {
        const catRows = [...pfcMap.entries()].map(([detailed, primary]) => ({
          id: detailed,
          name: detailed ??
            primary.split('__').join(' / ').replaceAll('_', ' ')
              .toLowerCase().replace(/\b\w/g, s => s.toUpperCase()),
          userId: bank.userId,
          plaid_id: detailed,
        }));

        const r = await db
          .insert(categories)
          .values(catRows)
          .onConflictDoNothing()
          .returning({ id: categories.id });

        insertedCategories += r.length;
      }

      const usedAccIds = Array.from(new Set(res.data.added.map(t => t.account_id)));
      let accMap = new Map<string, string>();
      if (usedAccIds.length) {
        const rows = await db
          .select({ id: accounts.id, plaidId: accounts.plaid_id })
          .from(accounts)
          .where(and(eq(accounts.userId, bank.userId), inArray(accounts.plaid_id, usedAccIds)));
        accMap = new Map(rows.map(r => [r.plaidId!, r.id]));
      }

      for (const t of res.data.added) {
        const accountId = accMap.get(t.account_id);
        if (!accountId) continue;

        const detailed = t.personal_finance_category?.detailed ?? null;

        toInsert.push({
          id: uuidv4(),
          amount: convertAmountToMilliunits(t.amount),
          payee: t.merchant_name || t.name,
          date: new Date(t.date),
          accountId,
          categoryId: detailed ? buildPfcCategoryId(bank.userId, detailed) : null,
        });
      }

      cursor = res.data.next_cursor;
      if (!res.data.has_more) break;
    }

    if (toInsert.length) {
      await db.insert(transactions).values(toInsert);
    }

    await db.update(connectedBanks).set({ cursor }).where(eq(connectedBanks.id, bank.id));

    return ctx.json({ ok: true, inserted: { categories: insertedCategories, transactions: toInsert.length } });
  });

export default app;