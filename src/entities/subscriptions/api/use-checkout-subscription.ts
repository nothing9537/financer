import { useMutation } from '@tanstack/react-query';
import { InferResponseType } from 'hono';
import { toast } from 'sonner';

import { client } from '@/shared/api/hono/client';

type ResponseType = InferResponseType<typeof client.api.subscriptions['checkout']['$post'], 200>;

export const useCheckoutSubscription = () => {
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.subscriptions.checkout.$post();

      if (!response.ok) {
        throw new Error('Failed to create URL');
      }

      return await response.json();
    },
    onSuccess: ({ url }) => {
      window.location.href = url;
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};