import { client } from '@/shared/api/hono/client';
import { SUBSCRIPTION_QUERY_KEY } from '@/shared/lib/consts/query-keys';
import { useQuery } from '@tanstack/react-query';

export const useGetSubscription = () => {
  const query = useQuery({
    queryKey: SUBSCRIPTION_QUERY_KEY,
    queryFn: async () => {
      const response = await client.api.subscriptions.current.$get();

      if (!response.ok) {
        throw new Error('Failed to fetch subscription');
      }

      return (await response.json()).subscription;
    }
  });

  return query;
}