import { InferRequestType, InferResponseType } from 'hono';

import { client } from '@/shared/api/hono/client';
import { CATEGORIES_QUERY_KEY } from '@/shared/lib/consts/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type ResponseType = InferResponseType<typeof client.api.categories[":id"]['$patch']>;
type RequestType = InferRequestType<typeof client.api.categories[":id"]['$patch']>['json']

export const useEditCategory = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.categories[':id']['$patch']({ json, param: { id } });

      if (!response.ok) {
        throw new Error('Failed to create category');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Category updated");
      queryClient.refetchQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update category");
    },
  });

  return mutation;
};