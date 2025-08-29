import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

import { client } from '@/shared/api/hono/client';
import { TRANSACTIONS_QUERY_KEY } from '@/shared/lib/consts/query-keys';

export const useGetTransactions = () => {
  const params = useSearchParams();
  const from = params.get('from') || "";
  const to = params.get('to') || "";
  const accountId = params.get('accountId') || "";

  const query = useQuery({
    queryKey: TRANSACTIONS_QUERY_KEY,
    queryFn: async () => {
      const response = await client.api.transactions.$get({
        query: {
          from,
          to,
          accountId,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      return (await response.json()).transactions;
    }
  });

  return query;
}