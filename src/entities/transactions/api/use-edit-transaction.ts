import { toast } from 'sonner';
import { InferRequestType, InferResponseType } from 'hono';

import { client } from '@/shared/api/hono/client';
import { TRANSACTIONS_QUERY_KEY, TRANSACTION_QUERY_KEY } from '@/shared/lib/consts/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type ResponseType = InferResponseType<typeof client.api.transactions[":id"]['$patch']>;
type RequestType = InferRequestType<typeof client.api.transactions[":id"]['$patch']>['json']

export const useEditTransaction = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.transactions[':id']['$patch']({ json, param: { id } });

      if (!response.ok) {
        throw new Error('Failed to update transaction');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Transaction updated");
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: TRANSACTION_QUERY_KEY(id) });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update transaction");
    },
  });

  return mutation;
};