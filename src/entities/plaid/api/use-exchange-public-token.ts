import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/shared/api/hono/client';
import { ACCOUNTS_QUERY_KEY, CATEGORIES_QUERY_KEY, CONNECTED_BANK_KEY, SUMMARY_QUERY_KEY, TRANSACTIONS_QUERY_KEY } from '@/shared/lib/consts/query-keys';

type ResponseType = InferResponseType<typeof client.api.plaid['exchange-public-token']['$post'], 201>;
type RequestType = InferRequestType<typeof client.api.plaid['exchange-public-token']['$post']>['json'];

export const useExchangePublicToken = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.plaid['exchange-public-token'].$post({ json });

      if (!response.ok) {
        throw new Error('Failed to exchange public token');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Public token exchanged");

      queryClient.invalidateQueries({ queryKey: CONNECTED_BANK_KEY });
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: SUMMARY_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};