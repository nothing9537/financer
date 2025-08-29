import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

import { ACCOUNTS_QUERY_KEY, ACCOUNT_QUERY_KEY } from '@/shared/lib/consts/query-keys';
import { client } from '@/shared/api/hono/client';

type ResponseType = InferResponseType<typeof client.api.accounts[":id"]['$patch']>;
type RequestType = InferRequestType<typeof client.api.accounts[":id"]['$patch']>['json']

export const useEditAccount = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.accounts[':id']['$patch']({ json, param: { id } });

      if (!response.ok) {
        throw new Error('Failed to update account');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Account updated");
      queryClient.refetchQueries({ queryKey: ACCOUNTS_QUERY_KEY });
      queryClient.refetchQueries({ queryKey: ACCOUNT_QUERY_KEY(id) });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update account");
    },
  });

  return mutation;
};