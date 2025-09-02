import { InferResponseType } from 'hono';

import { client } from '@/shared/api/hono/client';
import { TRANSACTIONS_QUERY_KEY, TRANSACTION_QUERY_KEY } from '@/shared/lib/consts/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type ResponseType = InferResponseType<typeof client.api.transactions[":id"]['$delete']>;

export const useDeleteTransaction = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.transactions[':id']['$delete']({ param: { id } });

      if (!response.ok) {
        throw new Error('Failed to delete transaction');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Transaction deleted");
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: TRANSACTION_QUERY_KEY(id) });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete transaction");
    },
  });

  return mutation;
};