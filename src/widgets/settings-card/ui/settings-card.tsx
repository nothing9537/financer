'use client';

import { Loader2 } from 'lucide-react';

import { PlaidConnectButton } from '@/features/plaid-connect';
import { PlaidDisconnectButton } from '@/features/plaid-disconnect';
import { SubscriptionsButton } from '@/features/subscribe-button';

import { useGetSubscription } from '@/entities/subscriptions';
import { useGetConnectedBank } from '@/entities/plaid';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';
import { Skeleton } from '@/shared/ui/skeleton';
import { cn } from '@/shared/lib/utils/cn';

export const SettingsCard: React.FC = () => {
  const connectedBankQuery = useGetConnectedBank();
  const subscriptionQuery = useGetSubscription();

  const isBankConnected = connectedBankQuery?.data?.accessToken;
  const isSubscriptionExists = subscriptionQuery.data;

  if (connectedBankQuery.isLoading || subscriptionQuery.isLoading) {
    return (
      <Card className="border-none drop-shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl line-clamp-1">
            <Skeleton className="h-6 w-24" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Separator />
          <div className="h-fit w-full flex items-center justify-center py-4">
            <Loader2 className="size-6 text-slate-300 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='border-none drop-shadow-sm'>
      <CardHeader>
        <CardTitle className='text-xl line-clamp-1'>
          Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Separator />
        <div className='flex flex-col gap-y-2 lg:flex-row items-center py-4'>
          <p className='text-sm font-medium w-full lg:w-3xs'>
            Bank Account
          </p>
          <div className='w-full flex items-center justify-between'>
            <div className={cn('text-sm truncate flex items-center', !isBankConnected && 'text-muted-foreground')}>
              {isBankConnected ? (
                'Bank account connected'
              ) : (
                'No bank account connected'
              )}
            </div>
            {isBankConnected ? <PlaidDisconnectButton /> : <PlaidConnectButton />}
          </div>
        </div>
        <Separator />
        <div className='flex flex-col gap-y-2 lg:flex-row items-center py-4'>
          <p className='text-sm font-medium w-full lg:w-3xs'>
            Subscription
          </p>
          <div className='w-full flex items-center justify-between'>
            <div className={cn('text-sm truncate flex items-center', !isSubscriptionExists && 'text-muted-foreground')}>
              {isSubscriptionExists ? (
                `Subscription ${subscriptionQuery.data?.status}`
              ) : (
                'No subscription active'
              )}
            </div>
            <SubscriptionsButton />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};