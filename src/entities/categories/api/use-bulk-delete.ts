import { toast } from 'sonner';
import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/shared/api/hono/client';
import { CATEGORIES_QUERY_KEY } from '@/shared/lib/consts/query-keys';

type ResponseType = InferResponseType<typeof client.api.categories["bulk-delete"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.categories["bulk-delete"]["$post"]>['json'];

export const useBulkDeleteCategories = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.categories['bulk-delete'].$post({ json });

      return await response.json();
    },
    onSuccess: () => {
      toast.success('Categories deleted');
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete categories")
    }
  });

  return mutation;
};