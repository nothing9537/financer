import { useModal } from '@/shared/lib/hooks/use-modal';
import { useGetSubscription } from '../../api/use-get-subscription';

export const usePaywall = () => {
  const paywallModal = useModal<'subscription-modal'>();

  const { data: subscription, isLoading } = useGetSubscription();

  const shouldBlock = !subscription || subscription.status === 'expired';

  return {
    isLoading,
    shouldBlock,
    triggerPaywall: () => {
      paywallModal.onOpen('subscription-modal');
    }
  } as const;
};