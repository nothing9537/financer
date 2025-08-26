import { Hono } from 'hono';
import { v4 as uuidv4 } from 'uuid';
import { zValidator } from '@hono/zod-validator'
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { eq } from 'drizzle-orm';

import { accounts } from '@/schemas';
import { insertAccountsSchema } from '@/schemas/accounts';
import { db } from '@/db';

const app = new Hono()
  .get("/", clerkMiddleware(), async (ctx) => {
    const auth = getAuth(ctx);

    if (!auth?.isAuthenticated) {
      return ctx.json({ message: 'Unauthorized' }, 401);
    }

    const data = await db
      .select({ id: accounts.id, name: accounts.name })
      .from(accounts)
      .where(eq(accounts.userId, auth.userId));

    return ctx.json({ accounts: data });
  })
  .post("/", clerkMiddleware(), zValidator("json", insertAccountsSchema.pick({ name: true })), async (ctx) => {
    const auth = getAuth(ctx);
    const values = ctx.req.valid("json");

    if (!auth?.isAuthenticated) {
      return ctx.json({ message: 'Unauthorized' }, 401);
    }

    const [data] = await db.insert(accounts).values({
      id: uuidv4(),
      userId: auth.userId,
      name: values.name,
    }).returning();

    return ctx.json({ payload: data }, 201);
  });

export default app;