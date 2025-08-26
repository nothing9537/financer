import { Hono } from 'hono';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';

import { db } from '@/db';
import { accounts } from '@/schemas';
import { eq } from 'drizzle-orm';

const app = new Hono()
  .get("/",
    clerkMiddleware(),
    async (ctx) => {
      const auth = getAuth(ctx);

      if (!auth?.isAuthenticated) {
        return ctx.json({ message: 'Unauthorized' }, 401);
      }

      const data = await db
        .select({ id: accounts.id, name: accounts.name })
        .from(accounts)
        .where(eq(accounts.userId, auth.userId));

      return ctx.json({ accounts: data });
    });

export default app;