import { toast } from 'sonner';
import { InferRequestType, InferResponseType } from 'hono';

import { client } from '@/shared/api/hono/client';
import { CATEGORIES_QUERY_KEY } from '@/shared/lib/consts/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type ResponseType = InferResponseType<typeof client.api.categories.$post>;
type RequestType = InferRequestType<typeof client.api.categories.$post>['json'];

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.categories.$post({ json });

      if (!response.ok) {
        throw new Error('Failed to create category');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Category created");
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create category");
    },
  });

  return mutation;
};