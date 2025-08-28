import { client } from '@/shared/api/hono/client';
import { CATEGORIES_QUERY_KEY } from '@/shared/lib/consts/query-keys';
import { useQuery } from '@tanstack/react-query';

export const useGetCategories = () => {
  const query = useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: async () => {
      const response = await client.api.categories.$get();

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      return (await response.json()).categories;
    }
  });

  return query;
}