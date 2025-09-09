import { useDeleteConnectedBank } from '@/entities/plaid';
import { useConfirm } from '@/shared/lib/hooks/use-confirm';
import { Button } from '@/shared/ui/button';
import { useAuth } from '@clerk/nextjs';

const VERSION = 'v1';

export const PlaidDisconnectButton: React.FC = () => {
  const { isPending, mutate } = useDeleteConnectedBank();
  const { userId } = useAuth();
  const [ConfirmDialog, confirm] = useConfirm({
    title: 'Are you sure?',
    description: 'Disconnect accounts means that all your categories, transactions, and accounts will be permanently deleted, and you will have to import them again if you want to.'
  });

  const onClick = async () => {
    const ok = await confirm();

    if (ok) {
      mutate();

      localStorage.removeItem(`cats_seeded:${VERSION}:${userId}`);

      window.location.reload();
    }
  };

  return (
    <>
      <ConfirmDialog />
      <Button size={'sm'} variant={'ghost'} disabled={isPending} onClick={onClick}>
        Disconnect
      </Button>
    </>
  );
};