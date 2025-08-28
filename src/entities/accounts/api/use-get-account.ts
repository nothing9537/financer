import { useQuery } from '@tanstack/react-query';

import { client } from '@/shared/api/hono/client';
import { ACCOUNT_QUERY_KEY } from '@/shared/lib/consts/query-keys';

export const useGetAccount = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: ACCOUNT_QUERY_KEY(id || ''),
    queryFn: async () => {
      const response = await client.api.accounts[':id'].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch account');
      }

      return (await response.json()).account;
    }
  });

  return query;
}