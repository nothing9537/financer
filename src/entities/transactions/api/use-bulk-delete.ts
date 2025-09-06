import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { SUMMARY_QUERY_KEY, TRANSACTIONS_QUERY_KEY } from '@/shared/lib/consts/query-keys';
import { client } from '@/shared/api/hono/client';

type ResponseType = InferResponseType<typeof client.api.transactions["bulk-delete"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.transactions["bulk-delete"]["$post"]>['json'];

export const useBulkDeleteTransactions = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.transactions['bulk-delete'].$post({ json });

      return await response.json();
    },
    onSuccess: () => {
      toast.success('Transactions deleted');
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: SUMMARY_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete transactions")
    }
  });

  return mutation;
};