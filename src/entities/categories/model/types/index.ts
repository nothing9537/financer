import { InferResponseType } from 'hono';

import { client } from '@/shared/api/hono/client';

export type Category = InferResponseType<typeof client.api.categories.$get, 200>['categories'][number];