import { Button } from '@/shared/ui/button';
import { useCheckoutSubscription, useGetSubscription } from '@/entities/subscriptions';

export const SubscriptionsButton: React.FC = () => {
  const checkoutMutation = useCheckoutSubscription();
  const subscriptionQuery = useGetSubscription();

  return (
    <Button size={'sm'} variant={'ghost'} disabled={checkoutMutation.isPending} onClick={() => checkoutMutation.mutate()}>
      {subscriptionQuery.data ? 'Manage' : 'Upgrade'}
    </Button>
  );
};