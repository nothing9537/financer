'use client';

import { Button } from '@/shared/ui/button'

import { usePlaidConnectButton } from '../lib/hooks/use-plaid-connect-button';

export const PlaidConnectButton: React.FC = () => {
  const { isDisabled, plaid } = usePlaidConnectButton();

  return (
    <Button size={'sm'} variant={'ghost'} disabled={isDisabled} onClick={() => plaid.open()}>
      Connect
    </Button>
  );
};