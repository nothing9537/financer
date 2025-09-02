import { useModal } from '@/shared/lib/hooks/use-modal';
import { Button } from '@/shared/ui/button';

export const ApplyAccountButton: React.FC = () => {
  const { onOpen } = useModal();

  return (
    <Button onClick={() => onOpen('apply-account-modal')} variant='outline'>
      Apply account
    </Button>
  );
};