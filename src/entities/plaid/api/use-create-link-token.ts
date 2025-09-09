import { useMutation } from '@tanstack/react-query';
import { InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/shared/api/hono/client';

type ResponseType = InferResponseType<typeof client.api.plaid['create-link-token']['$post'], 201>;

export const useCreateLinkToken = () => {
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.plaid['create-link-token'].$post();

      if (!response.ok) {
        throw new Error('Failed to create link token');
      }

      return await response.json();
    },
    onError: () => {
      toast.error("Failed to create link token");
    },
  });

  return mutation;
};