import { InferResponseType } from 'hono';

import { client } from '@/shared/api/hono/client';

export type Account = InferResponseType<typeof client.api.accounts.$get, 200>['accounts'][0];