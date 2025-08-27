import { useState } from 'react';

import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';

interface UseConfirmProps {
  description: string;
  title: string;
}

export const useConfirm = ({ description, title }: UseConfirmProps): [() => React.JSX.Element, () => Promise<unknown>] => {
  const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null);

  const confirm = () => new Promise((resolve, _) => {
    setPromise({ resolve });
  });

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve?.(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve?.(false);
    handleClose();
  };

  const ConfirmationDialog = () => (
    <Dialog open={promise !== null}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='pt-2'>
          <Button onClick={handleCancel} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return [ConfirmationDialog, confirm];
}