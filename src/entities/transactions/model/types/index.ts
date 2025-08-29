import { client } from '@/shared/api/hono/client';
import { InferResponseType } from 'hono';

export type Transaction = InferResponseType<typeof client.api.transactions.$get, 200>['transactions'][number];