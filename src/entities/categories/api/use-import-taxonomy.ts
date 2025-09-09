import { InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { client } from '@/shared/api/hono/client';
import { CATEGORIES_QUERY_KEY } from '@/shared/lib/consts/query-keys';

type ResponseType = InferResponseType<typeof client.api.categories['import-taxonomy']['$post']>;

export const useImportTaxonomy = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.categories['import-taxonomy'].$post();

      if (!response.ok) {
        throw new Error('Failed to import taxonomy');
      }

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};