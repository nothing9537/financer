import { useQuery } from '@tanstack/react-query';

import { client } from '@/shared/api/hono/client';
import { TRANSACTION_QUERY_KEY } from '@/shared/lib/consts/query-keys';

export const useGetTransaction = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: TRANSACTION_QUERY_KEY(id || ''),
    queryFn: async () => {
      const response = await client.api.transactions[':id'].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transaction');
      }

      return (await response.json()).transaction;
    }
  });

  return query;
}