import { InferResponseType } from 'hono';

import { client } from '@/shared/api/hono/client';
import { ACCOUNTS_QUERY_KEY } from '@/shared/lib/consts/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type ResponseType = InferResponseType<typeof client.api.accounts[":id"]['$delete']>;

export const useDeleteAccount = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.accounts[':id']['$delete']({ param: { id } });

      if (!response.ok) {
        throw new Error('Failed to create account');
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Account deleted");
      queryClient.refetchQueries({ queryKey: ACCOUNTS_QUERY_KEY });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete account");
    },
  });

  return mutation;
};