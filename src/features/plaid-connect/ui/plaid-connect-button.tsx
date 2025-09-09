'use client';

import { Button } from '@/shared/ui/button'
import { usePaywall } from '@/entities/subscriptions';

import { usePlaidConnectButton } from '../lib/hooks/use-plaid-connect-button';

export const PlaidConnectButton: React.FC = () => {
  const { isDisabled, plaid } = usePlaidConnectButton();
  const { shouldBlock, triggerPaywall, isLoading } = usePaywall();

  const onClick = () => {
    if (shouldBlock) {
      triggerPaywall();

      return;
    }

    plaid.open();
  };

  return (
    <Button size={'sm'} variant={'ghost'} disabled={isDisabled || isLoading} onClick={onClick}>
      Connect
    </Button>
  );
};