import { useState } from 'react';

import { AccountSelect } from '@/entities/accounts';
import { SelectOption } from '@/shared/types/select-option';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { useModal } from '@/shared/lib/hooks/use-modal';
import { useCSVTransactionsStore } from '@/entities/transactions';

export const ApplyAccountModal: React.FC = () => {
  const [account, setAccount] = useState<SelectOption<string>>({ label: '', value: '' });
  const { type, isOpen, onClose } = useModal();
  const { data, setData } = useCSVTransactionsStore();

  const handleChange = (accountId?: string, account?: string) => {
    if (accountId && account) {
      setAccount({ label: account, value: accountId });
    }
  };

  const handleConfirm = () => {
    const newData = data.map((t) => ({ ...t, account: account.label, accountId: account.value }));

    setData(newData);
    onClose();
  };

  const isModalOpen = type === 'apply-account-modal' && isOpen;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Apply the selected account to all transactions?
          </DialogTitle>
          <DialogDescription>
            You can select an existing account from your list (or create a new one) and apply it to all imported transactions.
          </DialogDescription>
        </DialogHeader>
        <AccountSelect
          onChange={handleChange}
          value={account.value}
        />
        <DialogFooter className='pt-2'>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};