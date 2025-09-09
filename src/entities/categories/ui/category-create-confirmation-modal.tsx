import { useModal } from '@/shared/lib/hooks/use-modal';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';

import { useCreateCategory } from '../api/use-create-category';

export const CategoryCreateConfirmationModal: React.FC = () => {
  const { isOpen, type, onClose, data } = useModal<'create-category-confirmation'>();
  const mutation = useCreateCategory();

  const isOpenModal = isOpen && type === 'create-category-confirmation';

  const handleConfirm = () => {
    if (data?.transaction?.category) {
      mutation.mutate({
        name: data.transaction.category
      }, {
        onSuccess: ({ payload }) => {
          onClose();
          data?.onConfirm?.({ name: payload.name, id: payload.id });
        }
      });
    }
  };

  const handleCancel = () => {
    data?.onCancel?.();
    onClose();
  };

  return (
    <Dialog open={isOpenModal} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Category &quot;{data?.transaction?.category}&quot; not found
          </DialogTitle>
          <DialogDescription>
            We did not find this category in your list of created categories. Would you like to create it?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleCancel} variant="outline" disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={mutation.isPending} autoFocus>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};