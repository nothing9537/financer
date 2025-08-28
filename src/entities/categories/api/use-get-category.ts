import { useQuery } from '@tanstack/react-query';

import { client } from '@/shared/api/hono/client';
import { CATEGORY_QUERY_KEY } from '@/shared/lib/consts/query-keys';

export const useGetCategory = (id?: string) => {
  const query = useQuery({
    enabled: !!id,
    queryKey: CATEGORY_QUERY_KEY(id || ''),
    queryFn: async () => {
      const response = await client.api.categories[':id'].$get({
        param: { id },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch category');
      }

      return (await response.json()).category;
    }
  });

  return query;
}