import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

import { useModal } from '@/shared/lib/hooks/use-modal';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Separator } from '@/shared/ui/separator';
import { PaidFeatures } from '../lib/consts/paid-features';
import { Button } from '@/shared/ui/button';
import { useCheckoutSubscription } from '../api/use-checkout-subscription';

export const PaywallModal: React.FC = () => {
  const { isOpen, type, onClose } = useModal<'subscription-modal'>();
  const checkout = useCheckoutSubscription();

  return (
    <Dialog open={isOpen && type === 'subscription-modal'} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className='flex items-center space-y-4'>
          <Image
            src={'/logo-dark.svg'}
            alt='Logo'
            width={36}
            height={36}
          />
          <DialogTitle className='text-center'>
            Upgrade to a paid plan
          </DialogTitle>
          <DialogDescription className='text-center'>
            Upgrade to a paid plan to unlock more features
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <ul className='space-y-2'>
          {PaidFeatures.map(({ label, feature }) => (
            <li className='flex items-center' key={feature}>
              <CheckCircle2 className='size-4 mr-2 fill-blue-500 text-white' />
              <p className='text-sm text-muted-foreground'>
                {label}
              </p>
            </li>
          ))}
        </ul>
        <DialogFooter className='pt-2 mt-4 gap-y-2'>
          <Button className='w-full' onClick={() => checkout.mutate()} disabled={checkout.isPending}>
            Upgrade
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};