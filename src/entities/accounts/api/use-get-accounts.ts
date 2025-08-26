import { client } from '@/shared/api/hono/client';
import { ACCOUNTS_QUERY_KEY } from '@/shared/lib/consts/query-keys';
import { useQuery } from '@tanstack/react-query';

export const useGetAccounts = () => {
  const query = useQuery({
    queryKey: ACCOUNTS_QUERY_KEY,
    queryFn: async () => {
      const response = await client.api.accounts.$get();

      if (!response.ok) {
        throw new Error('Failed to fetch accounts');
      }

      return (await response.json()).accounts;
    }
  });

  return query;
}