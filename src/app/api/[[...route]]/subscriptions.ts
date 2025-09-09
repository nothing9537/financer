import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { createCheckout, getSubscription } from '@lemonsqueezy/lemonsqueezy.js';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

import { db } from '@/db';
import { subscriptions } from '@/schemas';
import { setupLemon } from '@/shared/api/ls/ls';

setupLemon();

const app = new Hono()
  .get('/current', clerkMiddleware(), async (ctx) => {
    const auth = getAuth(ctx);

    if (!auth?.isAuthenticated) {
      return ctx.json({ message: 'Unauthorized' }, 401);
    }

    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, auth.userId));

    return ctx.json({ subscription: subscription || null });
  })
  .post('/checkout', clerkMiddleware(), async (ctx) => {
    const auth = getAuth(ctx);

    if (!auth?.isAuthenticated) {
      return ctx.json({ message: 'Unauthorized' }, 401);
    }

    const [existing] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, auth.userId));

    if (existing) {
      const subscription = await getSubscription(existing.subscriptionId);

      console.log(subscription, subscription.data, subscription.data?.data, subscription.data?.data.attributes);

      const portalUrl = subscription.data?.data.attributes.urls.customer_portal;

      if (!portalUrl) {
        return ctx.json({ message: 'Internal error' }, 500);
      }

      return ctx.json({ url: portalUrl }, 200);
    }

    const checkout = await createCheckout(
      process.env.LEMONSQUEEZY_STORE_ID!,
      process.env.LEMONSQUEEZY_PRODUCT_ID!,
      {
        checkoutData: {
          custom: {
            user_id: auth.userId,
          }
        },
        productOptions: {
          redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL!}/`,
        }
      },
    );

    const checkoutUrl = checkout.data?.data.attributes.url;

    if (!checkoutUrl) {
      return ctx.json({ message: 'Internal error' }, 500);
    }

    return ctx.json({ url: checkoutUrl }, 200);
  })
  .post('/webhook', async (ctx) => {
    const text = await ctx.req.text();

    const hmac = crypto.createHmac('sha256', process.env.LEMONSQUEEZY_WEBHOOK_SECRET!);
    const digest = Buffer.from(hmac.update(text).digest('hex'), 'utf-8');
    const signature = Buffer.from(ctx.req.header('x-signature') as string, 'utf-8');

    if (!crypto.timingSafeEqual(digest, signature)) {
      return ctx.json({ message: 'Unauthorized' }, 401);
    }

    const payload = JSON.parse(text);

    const event = payload.meta.event_name;
    const subscriptionId = payload.data.id;
    const userId = payload.meta.custom_data.user_id;
    const status = payload.data.attributes.status;

    const [existing] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.subscriptionId, subscriptionId));

    if (event === "subscription_created") {
      if (existing) {
        await db
          .update(subscriptions)
          .set({
            status,
          })
          .where(eq(subscriptions.subscriptionId, subscriptionId));
      } else {
        await db
          .insert(subscriptions)
          .values({
            id: uuidv4(),
            subscriptionId,
            userId,
            status,
          });
      }
    }

    if (event === "subscription_updated") {
      if (existing) {
        await db
          .update(subscriptions)
          .set({
            status,
          })
          .where(eq(subscriptions.subscriptionId, subscriptionId));
      } else {
        await db
          .insert(subscriptions)
          .values({
            id: uuidv4(),
            subscriptionId,
            userId,
            status,
          });
      }
    }

    return ctx.json({}, 200);
  });

export default app;