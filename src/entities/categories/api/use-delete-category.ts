import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { InferResponseType } from 'hono';

import { CATEGORIES_QUERY_KEY, CATEGORY_QUERY_KEY, TRANSACTIONS_QUERY_KEY } from '@/shared/lib/consts/query-keys';
import { client } from '@/shared/api/hono/client';

type ResponseType = InferResponseType<typeof client.api.categories[":id"]['$delete']>;

export const useDeleteCategory = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.categories[':id']['$delete']({ param: { id } });

      if (!response.ok) {
        throw new Error('Failed to create category');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Category deleted");
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: CATEGORY_QUERY_KEY(id) });
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete category");
    },
  });

  return mutation;
};