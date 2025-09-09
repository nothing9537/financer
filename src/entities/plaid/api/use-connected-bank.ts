import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { client } from '@/shared/api/hono/client';
import { ACCOUNTS_QUERY_KEY, CATEGORIES_QUERY_KEY, CONNECTED_BANK_KEY, SUMMARY_QUERY_KEY, TRANSACTIONS_QUERY_KEY } from '@/shared/lib/consts/query-keys';
import { InferResponseType } from 'hono';
import { toast } from 'sonner';

export const useGetConnectedBank = () => {
  const query = useQuery({
    queryKey: CONNECTED_BANK_KEY,
    queryFn: async () => {
      const response = await client.api.plaid['connected-bank'].$get();

      if (!response.ok) {
        throw new Error('Failed to fetch connected bank');
      }

      return (await response.json()).data;
    }
  });

  return query;
}

type DeleteConnectedBankResponseType = InferResponseType<typeof client.api.plaid['connected-bank']['$delete'], 200>;

export const useDeleteConnectedBank = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<DeleteConnectedBankResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.plaid['connected-bank'].$delete();

      if (!response.ok) {
        throw new Error('Failed to delete connected bank');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success('Connected bank deleted');

      queryClient.invalidateQueries({ queryKey: CONNECTED_BANK_KEY });
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: SUMMARY_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  return mutation;
}