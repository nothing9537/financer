import { InferRequestType, InferResponseType } from 'hono';

import { client } from '@/shared/api/hono/client';
import { TRANSACTIONS_QUERY_KEY } from '@/shared/lib/consts/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type ResponseType = InferResponseType<typeof client.api.transactions.$post>;
type RequestType = InferRequestType<typeof client.api.transactions.$post>['json'];

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.transactions.$post({ json });

      if (!response.ok) {
        throw new Error('Failed to create transaction');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Transaction created");
      queryClient.refetchQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create transaction");
    },
  });

  return mutation;
};