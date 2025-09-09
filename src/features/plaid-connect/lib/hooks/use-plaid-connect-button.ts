import { useState } from 'react';
import { useMount } from 'react-use';
import { usePlaidLink } from 'react-plaid-link';
import { useCreateLinkToken, useExchangePublicToken } from '@/entities/plaid';

export const usePlaidConnectButton = () => {
  const [token, setToken] = useState<string | null>(null)

  const createLinkTokenMutation = useCreateLinkToken();
  const exchangePublicTokenMutation = useExchangePublicToken();

  useMount(() => {
    createLinkTokenMutation.mutate(undefined, {
      onSuccess: ({ token }) => {
        setToken(token);
      },
    });
  });

  const plaid = usePlaidLink({
    token,
    env: 'sandbox',
    onSuccess: (public_token) => {
      exchangePublicTokenMutation.mutate({ public_token })
    },
  });

  const isDisabled =
    !plaid.ready || exchangePublicTokenMutation.isPending;

  return {
    plaid,
    isDisabled,
  } as const;
};