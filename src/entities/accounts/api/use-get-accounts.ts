import { client } from '@/shared/api/hono/client';
import { useQuery } from '@tanstack/react-query';

export const useGetAccounts = () => {
  const query = useQuery({
    queryKey: ["accounts"],
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